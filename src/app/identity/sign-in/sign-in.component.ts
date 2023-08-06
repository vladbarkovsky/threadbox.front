import { Component } from '@angular/core';
import { SignInForm } from './sign-in.form';
import { IdentityFacade } from '../identity.facade';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm = new SignInForm();

  constructor(private identityFacade: IdentityFacade) {}

  onSubmit() {
    this.identityFacade.signIn(this.signInForm.data);
  }
}
