import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardDto, BoardsClient, ListBoardDto } from 'api-client';
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
  }

  openAddBoardModal(): void {
    this.modal.open(AddBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openEditBoardModal(board: BoardDto): void {
    const modalRef = this.modal.open(EditBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
    modalRef.componentInstance.board = board;
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

  // private editBoard(boardForm: FormGroup): void {
  //   const boardDto = new BoardDto({
  //     title: boardForm.controls['title'].value,
  //     description: boardForm.controls['description'].value,
  //   });

  //   this.boardsClient.editBoard(boardDto).subscribe({
  //     next: x => {
  //       this.boards.push(x);
  //       this.toastService.show({ text: 'Board successfully added.', type: 'success' });
  //       this.modal.dismissAll();
  //     },
  //     error: () => {
  //       this.toastService.show({ text: 'Unable to add board.', type: 'danger' });
  //     },
  //   });
  // }
}
