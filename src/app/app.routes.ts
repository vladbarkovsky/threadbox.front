import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: 'shell', loadChildren: () => import('./shell/shell.routes').then(x => x.SHELL_ROUTES) },
  {
    path: 'authorization',
    loadChildren: () => import('./authorization/authorization.routes').then(x => x.AUTHORIZATION_ROUTES),
  },
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { path: '**', redirectTo: 'shell' },
];
