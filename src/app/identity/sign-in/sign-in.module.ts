import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { IdentityRoutingModule } from '../identity-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorsOnDirtyOrTouchedModule } from 'src/app/common/pipes/errors-on-dirty-on-touched.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule, IdentityRoutingModule, ReactiveFormsModule, ErrorsOnDirtyOrTouchedModule],
})
export class SignInModule {}
