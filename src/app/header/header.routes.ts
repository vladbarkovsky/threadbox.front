import { Routes } from '@angular/router';
import { HeaderComponent } from './header.component';
import { BoardListComponent } from '../board-list/board-list.component';
import { BoardComponent } from '../board/board.component';
import { BoardsListFacade } from '../board-list/boards-list.facade';
import { BoardsClient } from '../../../api-client';

export const HEADER_ROUTES: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'boards-list', component: BoardListComponent, providers: [BoardsListFacade, BoardsClient] },
      { path: 'board/:boardId', component: BoardComponent },
      { path: '', redirectTo: 'boards-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'boards-list' },
    ],
  },
  { path: '**', redirectTo: '' },
];
