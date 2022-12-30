import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListComponent } from './board-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BoardListComponent],
  imports: [CommonModule, RouterModule],
  exports: [BoardListComponent],
})
export class BoardListModule {}
