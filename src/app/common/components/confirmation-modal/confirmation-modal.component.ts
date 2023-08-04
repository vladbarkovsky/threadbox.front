import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemoryLeaksProtectedComponent } from '../memory-leaks-protected.component';
import { ConfirmationModalConfig } from './confirmation-modal-config';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent extends MemoryLeaksProtectedComponent {
  @Input() readonly config!: ConfirmationModalConfig;

  constructor(private activeModal: NgbActiveModal) {
    super();
  }

  accept() {
    this.config.action$.next(this.config.data);
  }

  decline() {
    this.activeModal.dismiss();
  }
}
