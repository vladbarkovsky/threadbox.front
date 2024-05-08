import { Routes } from '@angular/router';
import { LanguageComponent } from './language/language.component';

export const APP_ROUTES: Routes = [
  {
    path: ':language',
    component: LanguageComponent,
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
  // We must assign a non-existent language so that the AppComponent can assign it itself.
  { path: '', redirectTo: 'non-existent-language', pathMatch: 'full' },
];
