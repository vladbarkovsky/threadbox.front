import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesUploadComponent } from './images-upload.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImagesUploadComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ImagesUploadComponent],
})
export class ImagesUploadModule {}
