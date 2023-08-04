import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardDto } from 'api-client';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { EventService } from 'src/app/services/event.service';
import { BoardForm } from '../board-form';

@Component({
  selector: 'app-edit-board-modal',
  templateUrl: './edit-board-modal.component.html',
  styleUrls: ['./edit-board-modal.component.scss'],
})
export class EditBoardModalComponent extends MemoryLeaksProtectedComponent implements OnInit {
  @Input() readonly boardDto!: BoardDto;

  boardForm!: BoardForm;

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.boardForm = new BoardForm(this.boardDto);
  }
}
