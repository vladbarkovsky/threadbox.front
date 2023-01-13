import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() readonly config!: ConfirmationModalConfig;

  constructor(public activeModal: NgbActiveModal, public eventService: EventService) {}

  ngOnInit(): void {}
}

export interface ConfirmationModalConfig {
  title: string;
  text: string;
  data?: any;
  action$: ReplaySubject<any>;
}
