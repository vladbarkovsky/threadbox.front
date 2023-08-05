import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BoardsListModule } from './board-list/boards-list.module';
import { BoardModule } from './board/board.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, BoardsListModule, BoardModule],
})
export class HomeModule {}
