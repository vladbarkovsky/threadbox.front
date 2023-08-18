import { Injectable } from '@angular/core';
import { User, UserManager } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  get authorized$() {
    return this.user$.pipe(map(x => x !== null));
  }

  user$ = new BehaviorSubject<User | null>(null);

  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    redirect_uri: 'http://localhost:4200/authorization/sign-in-redirect-callback',
    response_type: 'code',
    scope: 'openid profile offline_access threadbox_api',
  });

  constructor() {
    if (!this.user$.value) {
      this.userManager.getUser().then(user => {
        if (user) {
        } else {
          this.signInRedirectCallback();
        }
      });
    }
  }

  signInRedirect() {
    return this.userManager.signinRedirect();
  }

  signInRedirectCallback() {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user$.next(user);
    });
  }

  signOut() {
    return this.userManager.signoutRedirect();
  }
}
