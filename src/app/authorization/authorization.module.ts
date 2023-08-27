import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { SignInRedirectCallbackComponent } from './sign-in-redirect-callback.component';
import { SignOutRedirectCallbackComponent } from './sign-out-redirect-callback.component';
import { SignInSilentCallbackComponent } from './sign-in-silent-callback.component';

@NgModule({
  declarations: [SignInRedirectCallbackComponent, SignInSilentCallbackComponent, SignOutRedirectCallbackComponent],
  imports: [CommonModule, AuthorizationRoutingModule],
  exports: [SignInRedirectCallbackComponent, SignInSilentCallbackComponent, SignOutRedirectCallbackComponent],
})
export class AuthorizationModule {}
