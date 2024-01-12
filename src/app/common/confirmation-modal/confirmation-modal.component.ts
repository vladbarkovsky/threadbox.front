import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalConfig } from './confirmation-modal-config';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
})
export class ConfirmationModalComponent {
  @Input() readonly config!: ConfirmationModalConfig;

  constructor(private activeModal: NgbActiveModal) {}

  accept() {
    this.activeModal.close();
  }

  decline() {
    this.activeModal.dismiss();
  }
}
