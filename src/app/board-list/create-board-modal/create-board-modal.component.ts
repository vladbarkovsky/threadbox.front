import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardForm } from './create-board.form';
import { BoardsListFacade } from '../boards-list.facade';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent {
  createBoardForm: CreateBoardForm = new CreateBoardForm();

  constructor(private activeModal: NgbActiveModal, private boardsListFacade: BoardsListFacade) {}

  onSubmit() {
    this.boardsListFacade.createBoard(this.createBoardForm.data, this.activeModal.close);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
