import { Routes } from '@angular/router';
import { SignInRedirectCallbackComponent } from './sign-in-redirect-callback.component';
import { SignOutRedirectCallbackComponent } from './sign-out-redirect-callback.component';

export const AUTHORIZATION_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'sign-in-redirect-callback', component: SignInRedirectCallbackComponent },
      { path: 'sign-out-redirect-callback', component: SignOutRedirectCallbackComponent },
      { path: '', redirectTo: 'app', pathMatch: 'full' },
      { path: '**', redirectTo: 'app' },
    ],
  },
  { path: '**', redirectTo: '' },
];
