import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardDto } from 'api-client';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-edit-board-modal',
  templateUrl: './edit-board-modal.component.html',
  styleUrls: ['./edit-board-modal.component.scss'],
})
export class EditBoardModalComponent implements OnInit {
  @Input() readonly board!: BoardDto;

  boardForm = this.formBuilder.group({
    title: [this.board.title, [Validators.required]],
    description: [this.board.description],
  });

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
