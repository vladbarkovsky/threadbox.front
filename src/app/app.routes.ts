import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: 'app', loadChildren: () => import('./header/header.routes').then(m => m.HEADER_ROUTES) },
  {
    path: 'authorization',
    loadChildren: () => import('./authorization/authorization.routes').then(m => m.AUTHORIZATION_ROUTES),
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', redirectTo: 'app' },
];
