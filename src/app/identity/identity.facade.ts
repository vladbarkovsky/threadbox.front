import { Injectable } from '@angular/core';
import { IdentityClient, SignInCommand, SignUpCommand } from 'api-client';
import { first } from 'rxjs/operators';
import { IdentityService } from './identity.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IdentityFacade {
  constructor(private identityClient: IdentityClient, private identityService: IdentityService, private router: Router) {}

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

  signUp(signUpCommand: SignUpCommand) {
    this.identityClient
      .signUp(signUpCommand)
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate(['/app/sign-in']),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }
}
