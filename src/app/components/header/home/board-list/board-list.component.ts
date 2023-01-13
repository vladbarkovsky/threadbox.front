import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardDto, BoardsClient, ListBoardDto } from 'api-client';
import { ConfirmationModalComponent, ConfirmationModalConfig } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddBoardModalComponent } from './add-board-modal/add-board-modal.component';
import { EditBoardModalComponent } from './edit-board-modal/edit-board-modal.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  boards: ListBoardDto[] = [];

  constructor(private boardsClient: BoardsClient, private toastService: ToastService, private modal: NgbModal, private eventService: EventService) {}

  ngOnInit(): void {
    this.boardsClient.getBoardsList().subscribe({
      next: x => (this.boards = x),
      error: () => this.toastService.show({ text: 'Unable to load boards.', type: 'danger' }),
    });

    this.eventService.addBoard$.subscribe(x => this.addBoard(x));
    this.eventService.editBoard$.subscribe(x => this.editBoard(x));
    this.eventService.deleteBoard$.subscribe(x => this.deleteBoard(x));
  }

  openAddBoardModal(): void {
    this.modal.open(AddBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  private addBoard(boardForm: FormGroup): void {
    const boardDto = new BoardDto({
      title: boardForm.controls['title'].value,
      description: boardForm.controls['description'].value,
    });

    this.boardsClient.createBoard(boardDto).subscribe({
      next: x => {
        this.boards.push(x);
        this.toastService.show({ text: 'Board successfully added.', type: 'success' });
        this.modal.dismissAll();
      },
      error: () => {
        this.toastService.show({ text: 'Unable to add board.', type: 'danger' });
      },
    });
  }

  openEditBoardModal(boardId: string): void {
    this.boardsClient.getBoard(boardId).subscribe({
      next: x => {
        const modalRef = this.modal.open(EditBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
        modalRef.componentInstance.board = x;
      },
      error: () => {
        this.toastService.show({ text: 'Unable to load board for editing.', type: 'danger' });
      },
    });
  }

  private editBoard(boardForm: FormGroup): void {
    const boardDto = new BoardDto({
      id: boardForm.controls['id'].value,
      title: boardForm.controls['title'].value,
      description: boardForm.controls['description'].value,
    });

    this.boardsClient.editBoard(boardDto).subscribe({
      next: x => {
        const index = this.boards.findIndex(board => board.id === x.id);
        this.boards[index] = x;

        this.toastService.show({ text: 'Board successfully edited.', type: 'success' });
        this.modal.dismissAll();
      },
      error: () => {
        this.toastService.show({ text: 'Unable to edit board.', type: 'danger' });
      },
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
    this.boardsClient.deleteBoard(boardId).subscribe({
      next: () => {
        this.boards = this.boards.filter(x => x.id !== boardId);
        this.modal.dismissAll();
        this.toastService.show({ text: 'Board successfully deleted.', type: 'success' });
      },
      error: () => {
        this.toastService.show({ text: 'Unable to delete board.', type: 'danger' });
      },
    });
  }
}
