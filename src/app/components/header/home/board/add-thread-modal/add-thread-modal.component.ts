import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from 'src/app/components/base.component';
import { ImagesUploadComponent } from 'src/app/components/images-upload/images-upload.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-add-thread-modal',
  templateUrl: './add-thread-modal.component.html',
  styleUrls: ['./add-thread-modal.component.scss'],
})
export class AddThreadModalComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(ImagesUploadComponent) imagesUploadComponent!: ImagesUploadComponent;

  threadForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    text: [''],
  });

  constructor(public activeModal: NgbActiveModal, public eventService: EventService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.threadForm.addControl('images', this.imagesUploadComponent.imagesForm);
  }
}
