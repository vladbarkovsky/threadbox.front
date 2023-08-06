import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListComponent as BoardsListComponent } from './board-list.component';
import { RouterModule } from '@angular/router';
import { CreateBoardModalModule } from './create-board-modal/create-board-modal.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBoardModalModule } from './update-board-modal/update-board-modal.module';
import { ConfirmationModalModule } from 'src/app/common/confirmation-modal/confirmation-modal.module';

@NgModule({
  declarations: [BoardsListComponent],
  imports: [CommonModule, RouterModule, NgbModalModule, CreateBoardModalModule, UpdateBoardModalModule, ConfirmationModalModule],
  exports: [BoardsListComponent],
})
export class BoardsListModule {}
