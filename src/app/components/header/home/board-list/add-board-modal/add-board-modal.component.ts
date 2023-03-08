import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from 'src/app/components/base.component';
import { EventService } from 'src/app/services/event.service';
import { BoardForm } from '../board-form';

@Component({
  selector: 'app-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent extends BaseComponent implements OnInit {
  boardForm: BoardForm = new BoardForm();

  constructor(public activeModal: NgbActiveModal, public eventService: EventService) {
    super();
  }

  ngOnInit(): void {}
}
