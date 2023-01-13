import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { ThreadModule } from './thread/thread.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddThreadModalModule } from './add-thread-modal/add-thread-modal.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, NgbModalModule, ThreadModule, AddThreadModalModule],
  exports: [BoardComponent],
})
export class BoardModule {}
