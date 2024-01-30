import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: 'shell', loadChildren: () => import('./shell/shell.routes').then(m => m.SHELL_ROUTES) },
  {
    path: 'authorization',
    loadChildren: () => import('./authorization/authorization.routes').then(m => m.AUTHORIZATION_ROUTES),
  },
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { path: '**', redirectTo: 'shell' },
];
