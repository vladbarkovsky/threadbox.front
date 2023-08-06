import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { ThreadsListModule } from './threads-list/threads-list.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, ThreadsListModule],
  exports: [BoardComponent],
})
export class BoardModule {}
