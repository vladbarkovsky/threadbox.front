import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { SignInRedirectCallbackComponent } from './sign-in-redirect-callback.component';

@NgModule({
  declarations: [SignInRedirectCallbackComponent],
  imports: [CommonModule, AuthorizationRoutingModule],
  exports: [SignInRedirectCallbackComponent],
})
export class AuthorizationModule {}
