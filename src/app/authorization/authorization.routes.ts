import { Routes } from '@angular/router';

export const AUTHORIZATION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in-redirect-callback',
        loadComponent: () => import('./sign-in-redirect-callback.component').then(x => x.SignInRedirectCallbackComponent),
      },
      {
        path: 'sign-out-redirect-callback',
        loadComponent: () => import('./sign-out-redirect-callback.component').then(x => x.SignOutRedirectCallbackComponent),
      },
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/' },
    ],
  },
  { path: '**', redirectTo: '' },
];
