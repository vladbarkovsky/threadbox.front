import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { MemoryLeaksProtectedComponent } from '../memory-leaks-protected.component';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent extends MemoryLeaksProtectedComponent implements OnInit {
  @Input() readonly config!: ConfirmationModalConfig;

  constructor(public activeModal: NgbActiveModal, public eventService: EventService) {
    super();
  }

  ngOnInit(): void {}
}

export interface ConfirmationModalConfig {
  title: string;
  text: string;
  data?: any;
  action$: Subject<any>;
}
