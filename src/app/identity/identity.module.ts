import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpModule } from './sign-up/sign-up.module';

@NgModule({
  declarations: [IdentityComponent],
  imports: [CommonModule, IdentityRoutingModule, SignInModule, SignUpModule],
})
export class IdentityModule {}
