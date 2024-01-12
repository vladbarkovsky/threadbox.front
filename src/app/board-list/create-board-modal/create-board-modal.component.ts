import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardForm } from './create-board.form';
import { BoardsListFacade } from '../boards-list.facade';
import { ErrorsOnDirtyOrTouchedPipe } from '../../common/pipes/errors-on-dirty-on-touched.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, ErrorsOnDirtyOrTouchedPipe],
})
export class CreateBoardModalComponent {
  createBoardForm: CreateBoardForm = new CreateBoardForm();

  constructor(
    private activeModal: NgbActiveModal,
    private boardsListFacade: BoardsListFacade
  ) {}

  onSubmit() {
    this.boardsListFacade.createBoard(this.createBoardForm.data, this.activeModal.close);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
