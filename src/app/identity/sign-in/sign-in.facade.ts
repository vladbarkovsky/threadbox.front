import { Injectable } from '@angular/core';
import { IdentityClient, SignInCommand } from 'api-client';
import { first } from 'rxjs/operators';
import { IdentityService } from '../identity.service';

@Injectable({ providedIn: 'root' })
export class SignInFacade {
  constructor(private identityClient: IdentityClient, private identityService: IdentityService) {}

  signIn(signInCommand: SignInCommand) {
    this.identityClient
      .signIn(signInCommand)
      .pipe(first())
      .subscribe({
        next: accessToken => this.identityService.authorize(accessToken),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }
}
