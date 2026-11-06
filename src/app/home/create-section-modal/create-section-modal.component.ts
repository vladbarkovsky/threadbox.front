import { Component, DestroyRef, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionClient } from '../../../../api-client';
import { CreateSectionForm } from './create-section.form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-create-section-modal',
	templateUrl: './create-section-modal.component.html',
	styleUrls: ['./create-section-modal.component.scss'],
	standalone: true,
	imports: [],
})
export class CreateSectionModalComponent {
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly sectionClient: SectionClient = inject(SectionClient);
	private readonly ngbActiveModal: NgbActiveModal = inject(NgbActiveModal);

	readonly createSectionForm: CreateSectionForm = new CreateSectionForm();

	onSubmit(): void {
		this.sectionClient
			.create(this.createSectionForm.data)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (): void => {
					this.ngbActiveModal.close();
				},
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
