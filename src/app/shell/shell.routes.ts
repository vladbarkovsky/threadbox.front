import { Routes } from '@angular/router';
import { ShellComponent as ShellComponent } from './shell.component';
import { BoardComponent } from '../board/board.component';
import { HomeComponent } from '../home/home.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'board/:boardId', component: BoardComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: '' },
];
