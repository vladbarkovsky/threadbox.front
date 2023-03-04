import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardDto, BoardsClient, ListBoardDto } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddBoardModalComponent } from './add-board-modal/add-board-modal.component';
import { EditBoardModalComponent } from './edit-board-modal/edit-board-modal.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent extends BaseComponent implements OnInit {
  boards: ListBoardDto[] = [];

  constructor(
    private boardsClient: BoardsClient,
    private toastService: ToastService,
    private modal: NgbModal,
    private eventService: EventService
  ) {
    super();
  }

  ngOnInit(): void {
    this.boardsClient
      .getBoardsList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => (this.boards = x),
        error: () => this.toastService.error('Unable to load boards.'),
      });

    this.eventService.addBoard$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.addBoard(x));
    this.eventService.editBoard$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.editBoard(x));
    this.eventService.deleteBoard$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.deleteBoard(x));
  }

  openAddBoardModal(): void {
    this.modal.open(AddBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  private addBoard(boardForm: FormGroup): void {
    const boardDto = new BoardDto({
      title: boardForm.controls['title'].value,
      description: boardForm.controls['description'].value,
    });

    this.boardsClient
      .createBoard(boardDto)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => {
          this.boards.push(x);
          this.toastService.success('Board successfully added.');
          this.modal.dismissAll();
        },
        error: () => {
          this.toastService.error('Unable to add board.');
        },
      });
  }

  openEditBoardModal(boardId: string): void {
    this.boardsClient
      .getBoard(boardId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => {
          const modalRef = this.modal.open(EditBoardModalComponent, {
            backdrop: 'static',
            keyboard: false,
            scrollable: true,
            size: 'lg',
          });
          modalRef.componentInstance.board = x;
        },
        error: () => {
          this.toastService.error('Unable to load board for editing.');
        },
      });
  }

  private editBoard(boardForm: FormGroup): void {
    const boardDto = new BoardDto({
      id: boardForm.controls['id'].value,
      title: boardForm.controls['title'].value,
      description: boardForm.controls['description'].value,
    });

    this.boardsClient
      .editBoard(boardDto)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => {
          const index = this.boards.findIndex(board => board.id === x.id);
          this.boards[index] = x;

          this.toastService.success('Board successfully edited.');
          this.modal.dismissAll();
        },
        error: () => this.toastService.error('Unable to edit board.'),
      });
  }

  openDeleteBoardModal(listBoardDto: ListBoardDto): void {
    const modalRef = this.modal.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false, scrollable: true });
    modalRef.componentInstance.config = {
      title: `Delete board ${listBoardDto.title}?`,
      text: 'Delete board?',
      data: listBoardDto.id,
      action$: this.eventService.deleteBoard$,
    } as ConfirmationModalConfig;
  }

  private deleteBoard(boardId: string): void {
    this.boardsClient
      .deleteBoard(boardId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.boards = this.boards.filter(x => x.id !== boardId);
          this.modal.dismissAll();
          this.toastService.success('Board successfully deleted.');
        },
        error: () => this.toastService.error('Unable to delete board.'),
      });
  }
}
