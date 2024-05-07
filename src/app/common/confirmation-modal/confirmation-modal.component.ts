import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  standalone: true,
  imports: [TranslocoDirective],
})
export class ConfirmationModalComponent {
  private readonly ngbActiveModal = inject(NgbActiveModal);

  @Input() readonly title?: string;
  @Input() readonly text!: string;

  close() {
    this.ngbActiveModal.close();
  }

  dismiss() {
    this.ngbActiveModal.dismiss();
  }
}
