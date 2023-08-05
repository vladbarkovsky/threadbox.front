import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBoardForm } from './update-board.form';
import { BoardsListFacade } from '../boards-list.facade';
import { BoardDto } from 'api-client';

@Component({
  selector: 'app-update-board-modal',
  templateUrl: './update-board-modal.component.html',
  styleUrls: ['./update-board-modal.component.scss'],
})
export class UpdateBoardModalComponent {
  @Input() readonly boardDto!: BoardDto;

  updateBoardForm: UpdateBoardForm | undefined;

  constructor(private activeModal: NgbActiveModal, private boardsListFacade: BoardsListFacade) {}

  onSubmit() {
    this.boardsListFacade.updateBoard(this.updateBoardForm!.data, this.activeModal.close);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
