import { Component } from '@angular/core';
import { IdentityFacade } from '../identity.facade';
import { IS4 } from '../IS4';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  constructor(private is4: IS4) {}

  signIn() {
    this.is4.signIn();
  }
}
