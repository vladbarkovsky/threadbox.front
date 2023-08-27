import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header.component';
import { HeaderRoutingModule } from './header-routing.module';
import { BoardModule } from '../board/board.module';
import { BoardsListModule } from '../board-list/boards-list.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, NgbCollapseModule, HeaderRoutingModule, BoardModule, BoardsListModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
