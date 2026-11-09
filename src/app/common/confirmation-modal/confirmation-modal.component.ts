import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../localization/translate.pipe';
import { TranslationKeys } from '../localization/translation-keys.enum';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
	standalone: true,
	imports: [TranslatePipe],
})
export class ConfirmationModalComponent {
	private readonly ngbActiveModal: NgbActiveModal = inject(NgbActiveModal);

	readonly translationKey: typeof TranslationKeys = TranslationKeys;
	@Input() readonly title?: TranslationKeys;
	@Input() text!: TranslationKeys;

	close(): void {
		this.ngbActiveModal.close();
	}

	dismiss(): void {
		this.ngbActiveModal.dismiss();
	}
}
