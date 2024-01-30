import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBoardForm } from './update-board.form';
import { BoardDto, BoardsClient } from '../../../../api-client';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorsPipe } from '../../common/pipes/validation-errors.pipe';
import { ToastService } from '../../common/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-board-modal',
  templateUrl: './update-board-modal.component.html',
  styleUrls: ['./update-board-modal.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsPipe],
})
export class UpdateBoardModalComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly boardsListClient = inject(BoardsClient);
  private readonly toastService = inject(ToastService);
  private readonly ngbActiveModal = inject(NgbActiveModal);

  @Input() readonly boardDto!: BoardDto;

  updateBoardForm!: UpdateBoardForm;

  ngOnInit(): void {
    this.updateBoardForm = new UpdateBoardForm(this.boardDto);
  }

  onSubmit(): void {
    this.boardsListClient
      .updateBoard(this.updateBoardForm!.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.ngbActiveModal.close();
          this.toastService.showSuccessToast('Board updated');
        },
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss();
  }
}
