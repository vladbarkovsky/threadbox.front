import { Component } from '@angular/core';
import { SignUpForm } from './sign-up.form';
import { IdentityFacade } from '../identity.facade';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm = new SignUpForm();

  constructor(private identityFacade: IdentityFacade) {}

  onSubmit() {
    this.identityFacade.signUp(this.signUpForm.data);
  }
}
