import { Component } from '@angular/core';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { SignUpForm } from './sign-up.form';
import { SignUpFacade } from './sign-up.facade';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm = new SignUpForm();

  constructor(private signUpFacade: SignUpFacade) {}

  onSubmit() {
    this.signUpFacade.signUp(this.signUpForm.data);
  }
}
