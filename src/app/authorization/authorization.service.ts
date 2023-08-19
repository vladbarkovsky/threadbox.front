import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, UserManager } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  get authorized$() {
    return this.user$.pipe(map(x => !!x));
  }

  user$ = new BehaviorSubject<User | undefined | null>(null);

  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    redirect_uri: 'http://localhost:4200/authorization/sign-in-redirect-callback',
    response_type: 'code',
    scope: 'openid profile offline_access threadbox_api',
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/authorization/sign-in-silent-callback',
  });

  constructor() {
    this.userManager.getUser().then(user => {
      if (user) {
        this.user$.next(user);
      } else {
        this.signInSilent();
      }
    });
  }

  signInRedirect() {
    return this.userManager.signinRedirect();
  }

  signInRedirectCallback() {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user$.next(user);
    });
  }

  signInSilent() {
    return this.userManager.signinSilent();
  }

  signInSilentCallback() {
    return this.userManager.signinSilentCallback().then(user => this.user$.next(user));
  }

  signOut() {
    return this.userManager.signoutRedirect();
  }
}
