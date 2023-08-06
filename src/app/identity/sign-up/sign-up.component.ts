import { Component } from '@angular/core';
import { IdentityFacade } from '../identity.facade';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(private identityFacade: IdentityFacade) {}

  signUp() {}
}
