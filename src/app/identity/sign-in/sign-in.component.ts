import { Component } from '@angular/core';
import { SignInForm } from './sign-in.form';
import { SignInFacade } from './sign-in.facade';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm = new SignInForm();

  constructor(private signInFacade: SignInFacade) {}

  onSubmit() {
    this.signInFacade.signIn(this.signInForm.data);
  }
}
