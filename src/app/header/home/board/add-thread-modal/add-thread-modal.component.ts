import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { ImagesUploadComponent } from 'src/app/common/images-upload/images-upload.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-add-thread-modal',
  templateUrl: './add-thread-modal.component.html',
  styleUrls: ['./add-thread-modal.component.scss'],
})
export class AddThreadModalComponent extends MemoryLeaksProtectedComponent implements OnInit, AfterViewInit {
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
