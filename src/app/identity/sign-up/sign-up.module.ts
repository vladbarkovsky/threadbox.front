import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IdentityRoutingModule } from '../identity-routing.module';
import { ErrorsOnDirtyOrTouchedModule } from 'src/app/common/pipes/errors-on-dirty-on-touched.module';

@NgModule({
  declarations: [SignUpComponent],
  imports: [CommonModule, IdentityRoutingModule, ReactiveFormsModule, ErrorsOnDirtyOrTouchedModule],
  exports: [SignUpComponent],
})
export class SignUpModule {}
