import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiUrlPipe } from './api-url.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ApiUrlPipe],
  exports: [ApiUrlPipe],
})
export class ApiUrlModule {}
