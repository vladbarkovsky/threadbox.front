import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsOnDirtyOrTouchedPipe } from './errors-on-dirty-on-touched.pipe';

@NgModule({
  declarations: [ErrorsOnDirtyOrTouchedPipe],
  imports: [CommonModule],
  exports: [ErrorsOnDirtyOrTouchedPipe],
})
export class ErrorsOnDirtyOrTouchedModule {}
