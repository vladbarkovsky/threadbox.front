import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBoardModalComponent as CreateBoardModalComponent } from './create-board-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoResizeModule } from 'src/app/common/directives/auto-resize/auto-resize.module';
import { ErrorsOnDirtyOrTouchedModule } from 'src/app/common/pipes/errors-on-dirty-on-touched.module';

@NgModule({
  declarations: [CreateBoardModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ErrorsOnDirtyOrTouchedModule, AutoResizeModule],
})
export class CreateBoardModalModule {}
