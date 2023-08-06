import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpSourceDirective as HttpSourceDirective } from './http-source.directive';

@NgModule({
  declarations: [HttpSourceDirective],
  imports: [CommonModule],
  exports: [HttpSourceDirective],
})
export class HttpSourceModule {}
