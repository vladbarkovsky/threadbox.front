import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { ThreadModule } from './thread/thread.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, ThreadModule],
  exports: [BoardComponent],
})
export class BoardModule {}
