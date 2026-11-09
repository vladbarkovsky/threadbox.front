import { Component, DestroyRef, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardForm } from './create-board.form';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../common/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SectionClient } from '../../../../api-client';
import { ToastStatus } from '../../common/toast/toast-status';
import { TranslatePipe } from '../../common/localization/translate.pipe';
import { TranslationKeys } from '../../common/localization/translation-keys.enum';

@Component({
	selector: 'app-create-board-modal',
	templateUrl: './create-board-modal.component.html',
	styleUrls: ['./create-board-modal.component.scss'],
	standalone: true,
	imports: [ReactiveFormsModule, TranslatePipe],
})
export class CreateBoardModalComponent {
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly sectionClient: SectionClient = inject(SectionClient);
	private readonly toastService: ToastService = inject(ToastService);
	private readonly ngbActiveModal: NgbActiveModal = inject(NgbActiveModal);

	@Input() sectionId!: string;
	readonly createBoardForm: CreateBoardForm = new CreateBoardForm();
	readonly translationKey: typeof TranslationKeys = TranslationKeys;

	onSubmit(): void {
		this.createBoardForm.sectionId = this.sectionId;

		this.sectionClient
			.create2(this.sectionId, this.createBoardForm.data)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (): void => {
					this.ngbActiveModal.close();
					this.toastService.showToast({ translationKey: TranslationKeys.Home_BoardCreated, status: ToastStatus.Success });
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
