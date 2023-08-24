import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserManager } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  get authorized$() {
    return this.user$.pipe(map(x => !!x && !x.expired));
  }

  get accessToken() {
    return this.user$.value?.access_token ?? undefined;
  }

  private user$ = new BehaviorSubject<User | undefined | null>(null);

  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    scope: 'openid profile offline_access threadbox_api',
    response_type: 'code',
    redirect_uri: 'https://localhost:4200/authorization/sign-in-redirect-callback',
    silent_redirect_uri: 'https://localhost:4200/authorization/sign-in-silent-callback',
    automaticSilentRenew: true,
  });

  constructor(private router: Router) {
    this.userManager.getUser().then(user => {
      if (user) {
        this.user$.next(user);
      } else {
        this.signInSilent();
      }
    });

    this.userManager.events.addAccessTokenExpired(() => {
      this.signInSilent();
    });
  }

  signInRedirect() {
    return this.userManager.signinRedirect().catch(error => {
      console.error('signinRedirect error:', error);
    });
  }

  signInRedirectCallback() {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user$.next(user);
      this.router.navigate(['/app/boards-list']);
    });
  }

  signInSilent() {
    return this.userManager.signinSilent().catch(error => {
      console.error('signinSilent error:', error);
    });
  }

  signInSilentCallback() {
    return this.userManager
      .signinSilentCallback()
      .catch(error => {
        console.error('signinSilentCallback error', error);
      })
      .then(user => {
        console.log('signInSilentCallback', user);
        this.user$.next(user!);
        this.router.navigate(['/app/boards-list']);
      });
  }

  signOut() {
    return this.userManager.signoutRedirect();
  }

  signOutRedirectCallback() {
    return this.userManager.signoutRedirectCallback();
  }
}
