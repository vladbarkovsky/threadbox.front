import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBoardModalComponent } from './edit-board-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoResizeModule } from 'src/app/directives/auto-resize/auto-resize.module';

@NgModule({
  declarations: [EditBoardModalComponent],
  imports: [CommonModule, ReactiveFormsModule, AutoResizeModule],
})
export class EditBoardModalModule {}
