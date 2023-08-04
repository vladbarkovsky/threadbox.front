import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListComponent } from './board-list.component';
import { RouterModule } from '@angular/router';
import { AddBoardModalModule } from './add-board-modal/add-board-modal.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditBoardModalModule } from './edit-board-modal/edit-board-modal.module';
import { ConfirmationModalModule } from 'src/app/common/components/confirmation-modal/confirmation-modal.module';

@NgModule({
  declarations: [BoardListComponent],
  imports: [CommonModule, RouterModule, NgbModalModule, AddBoardModalModule, EditBoardModalModule, ConfirmationModalModule],
  exports: [BoardListComponent],
})
export class BoardListModule {}
