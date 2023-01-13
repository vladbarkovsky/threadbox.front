import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  boardForm!: FormGroup;

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      id: [this.board.id],
      title: [this.board.title, [Validators.required]],
      description: [this.board.description],
    });
  }
}
