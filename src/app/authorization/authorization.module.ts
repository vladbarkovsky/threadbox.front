import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { SignInRedirectCallbackComponent } from './sign-in-redirect-callback.component';
import { SignInSilentCallbackComponent } from './sign-in-silent-callback.component';

@NgModule({
  declarations: [SignInRedirectCallbackComponent, SignInSilentCallbackComponent],
  imports: [CommonModule, AuthorizationRoutingModule],
  exports: [SignInRedirectCallbackComponent, SignInSilentCallbackComponent],
})
export class AuthorizationModule {}
