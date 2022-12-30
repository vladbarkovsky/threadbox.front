import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BoardListModule } from './board-list/board-list.module';
import { BoardModule } from './board/board.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, BoardListModule, BoardModule],
})
export class HomeModule {}
