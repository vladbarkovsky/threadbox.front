import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { EventService } from 'src/app/services/event.service';
import { BoardForm } from '../board-form';

@Component({
  selector: 'app-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent extends MemoryLeaksProtectedComponent implements OnInit {
  boardForm: BoardForm = new BoardForm();

  constructor(public activeModal: NgbActiveModal, public eventService: EventService) {
    super();
  }

  ngOnInit(): void {}
}
