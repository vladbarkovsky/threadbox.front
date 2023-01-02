import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent implements OnInit {
  boardForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: [''],
  });

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
