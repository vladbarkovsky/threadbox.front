import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-thread-modal',
  templateUrl: './create-thread-modal.component.html',
  styleUrls: ['./create-thread-modal.component.scss'],
  standalone: true,
})
export class AddThreadModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
