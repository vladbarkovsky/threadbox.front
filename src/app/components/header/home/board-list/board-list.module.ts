import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListComponent } from './board-list.component';
import { RouterModule } from '@angular/router';
import { AddBoardModalModule } from './add-board-modal/add-board-modal.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [BoardListComponent],
  imports: [CommonModule, RouterModule, AddBoardModalModule, NgbModalModule],
  exports: [BoardListComponent],
})
export class BoardListModule {}
