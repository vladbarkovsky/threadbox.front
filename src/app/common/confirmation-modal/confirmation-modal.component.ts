import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../localization/translate.pipe';
import { TranslationKey } from '../localization/translation-key.enum';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
	standalone: true,
	imports: [TranslatePipe],
})
export class ConfirmationModalComponent {
	private readonly ngbActiveModal = inject(NgbActiveModal);

	readonly translationKey = TranslationKey;
	@Input() readonly title?: TranslationKey;
	@Input() text!: TranslationKey;

	close(): void {
		this.ngbActiveModal.close();
	}

	dismiss(): void {
		this.ngbActiveModal.dismiss();
	}
}
