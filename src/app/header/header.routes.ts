import { Routes } from '@angular/router';
import { HeaderComponent } from './header.component';
import { BoardsListComponent } from '../boards-list/boards-list.component';
import { BoardComponent } from '../board/board.component';

export const HEADER_ROUTES: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'boards-list', component: BoardsListComponent },
      { path: 'board/:boardId', component: BoardComponent },
      { path: '', redirectTo: 'boards-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'boards-list' },
    ],
  },
  { path: '**', redirectTo: '' },
];
