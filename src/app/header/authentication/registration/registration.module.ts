import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from '../authentication-routing.module';

@NgModule({
  declarations: [RegistrationComponent],
  imports: [CommonModule, AuthenticationRoutingModule, ReactiveFormsModule],
  exports: [RegistrationComponent],
})
export class RegistrationModule {}
