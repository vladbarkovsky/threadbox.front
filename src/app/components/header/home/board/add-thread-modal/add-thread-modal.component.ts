import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-add-thread-modal',
  templateUrl: './add-thread-modal.component.html',
  styleUrls: ['./add-thread-modal.component.scss'],
})
export class AddThreadModalComponent implements OnInit {
  boardForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    text: [''],
    images: this.formBuilder.group({}),
  });

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
