import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header.component';
import { BoardListComponent } from '../board-list/board-list.component';
import { BoardComponent } from '../board/board.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'boards-list', component: BoardListComponent },
      { path: 'board/:boardId', component: BoardComponent },
      { path: '', redirectTo: 'boards-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'boards-list' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeaderRoutingModule {}
