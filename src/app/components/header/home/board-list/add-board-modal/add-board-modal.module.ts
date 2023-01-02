import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBoardModalComponent } from './add-board-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoResizeModule } from 'src/app/directives/auto-resize/auto-resize.module';

@NgModule({
  declarations: [AddBoardModalComponent],
  imports: [CommonModule, ReactiveFormsModule, AutoResizeModule],
})
export class AddBoardModalModule {}
