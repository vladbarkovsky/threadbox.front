import { Component, DestroyRef, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardForm } from './create-board.form';
import { ValidationErrorsPipe } from '../../common/pipes/validation-errors.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../common/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoardsClient } from '../../../../api-client';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsPipe],
})
export class CreateBoardModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly boardsClient = inject(BoardsClient);
  private readonly toastService = inject(ToastService);
  private readonly ngbActiveModal = inject(NgbActiveModal);

  readonly createBoardForm = new CreateBoardForm();

  onSubmit(): void {
    this.boardsClient
      .createBoard(this.createBoardForm.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.ngbActiveModal.close();
          this.toastService.showSuccessToast('Board created');
        },
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss();
  }
}
