import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInRedirectCallbackComponent } from './sign-in-redirect-callback.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'sign-in-redirect-callback', component: SignInRedirectCallbackComponent },
      { path: '', redirectTo: 'app', pathMatch: 'full' },
      { path: '**', redirectTo: 'app' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
