import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddThreadModalComponent } from './add-thread-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagesUploadModule } from 'src/app/components/images-upload/images-upload.module';

@NgModule({
  declarations: [AddThreadModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ImagesUploadModule],
})
export class AddThreadModalModule {}
