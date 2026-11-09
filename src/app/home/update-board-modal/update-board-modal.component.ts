import type { OnInit } from '@angular/core';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBoardForm } from './update-board.form';
import type { BoardDto } from '../../../../api-client';
import { BoardClient } from '../../../../api-client';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../common/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastStatus } from '../../common/toast/toast-status';
import { TranslatePipe } from '../../common/localization/translate.pipe';
import { TranslationKeys } from '../../common/localization/translation-keys.enum';

@Component({
	selector: 'app-update-board-modal',
	templateUrl: './update-board-modal.component.html',
	styleUrls: ['./update-board-modal.component.scss'],
	standalone: true,
	imports: [ReactiveFormsModule, TranslatePipe],
})
export class UpdateBoardModalComponent implements OnInit {
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly boardClient: BoardClient = inject(BoardClient);
	private readonly toastService: ToastService = inject(ToastService);
	private readonly ngbActiveModal: NgbActiveModal = inject(NgbActiveModal);

	@Input() readonly boardDto!: BoardDto;
	readonly translationKey: typeof TranslationKeys = TranslationKeys;

	updateBoardForm!: UpdateBoardForm;

	ngOnInit(): void {
		this.updateBoardForm = new UpdateBoardForm(this.boardDto);
	}

	onSubmit(): void {
		this.boardClient
			.update(this.boardDto.id, this.updateBoardForm.command)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (): void => {
					this.ngbActiveModal.close();
					this.toastService.showToast({ translationKey: TranslationKeys.Home_BoardUpdated, status: ToastStatus.Success });
				},
				// TODO: Set error in sign in state (error must be displayed in component)
				error: (error: unknown): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}

	cancel(): void {
		this.ngbActiveModal.dismiss();
	}
}
