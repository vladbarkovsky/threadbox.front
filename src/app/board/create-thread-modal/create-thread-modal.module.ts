import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddThreadModalComponent } from './create-thread-modal.component';
import { AutoResizeModule } from 'src/app/common/directives/auto-resize/auto-resize.module';

@NgModule({
  declarations: [AddThreadModalComponent],
  imports: [CommonModule, AutoResizeModule],
})
export class AddThreadModalModule {}
