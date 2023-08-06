import { CommonModule } from '@angular/common';
import { ThreadsListComponent } from './threads-list.component';
import { NgModule } from '@angular/core';
import { HttpSourceModule } from 'src/app/common/directives/http-source/http-source.module';

@NgModule({
  declarations: [ThreadsListComponent],
  imports: [CommonModule, HttpSourceModule],
  exports: [ThreadsListComponent],
})
export class ThreadsListModule {}
