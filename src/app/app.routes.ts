import { Routes } from '@angular/router';
import { defaultLanguage } from './app.config';
import { LocalStorageFacade } from './common/local-storage-facade';

export const APP_ROUTES: Routes = [
  {
    path: ':language',
    children: [
      { path: 'shell', loadChildren: () => import('./shell/shell.routes').then(x => x.SHELL_ROUTES) },
      {
        path: 'authorization',
        loadChildren: () => import('./authorization/authorization.routes').then(x => x.AUTHORIZATION_ROUTES),
      },
      { path: '', redirectTo: 'shell', pathMatch: 'full' },
      { path: '**', redirectTo: 'shell' },
    ],
  },
  { path: '', redirectTo: LocalStorageFacade.language ?? defaultLanguage, pathMatch: 'full' },
];
