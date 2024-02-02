import { Routes } from '@angular/router';
import { ShellComponent as ShellComponent } from './shell.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'home', loadComponent: () => import('../home/home.component').then(x => x.HomeComponent) },
      {
        path: 'board/:boardId',
        loadComponent: () => import('../board/board.component').then(x => x.BoardComponent),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: '' },
];
