import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddThreadModalComponent } from './add-thread-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagesUploadModule } from 'src/app/common/components/images-upload/images-upload.module';
import { AutoResizeModule } from 'src/app/directives/auto-resize/auto-resize.module';

@NgModule({
  declarations: [AddThreadModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ImagesUploadModule, AutoResizeModule],
})
export class AddThreadModalModule {}
