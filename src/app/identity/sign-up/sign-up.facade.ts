import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityClient, SignUpCommand } from 'api-client';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SignUpFacade {
  constructor(private identityClient: IdentityClient, private router: Router) {}

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
