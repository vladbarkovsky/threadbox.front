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

  user$ = new BehaviorSubject<User | undefined | null>(null);

  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    redirect_uri: 'https://localhost:4200/authorization/sign-in-redirect-callback',
    response_type: 'code',
    scope: 'openid profile offline_access threadbox_api',
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://localhost:4200/authorization/sign-in-silent-callback',
  });

  constructor(private router: Router) {
    this.userManager.events.addAccessTokenExpired(() => {
      this.signInSilent();
    });

    this.userManager.getUser().then(user => {
      this.user$.next(user);
    });
  }

  signInRedirect() {
    return this.userManager.signinRedirect();
  }

  signInRedirectCallback() {
    return this.userManager.signinRedirectCallback().then(user => {
      console.log('signInRedirectCallback', user);
      this.user$.next(user);
      this.router.navigate(['/app/boards-list']);
    });
  }

  signInSilent() {
    return this.userManager.signinSilent();
  }

  signInSilentCallback() {
    return this.userManager.signinSilentCallback().catch(error => {
      console.error('signinSilentCallback error', error);
    });
    // .then(user => {
    //   console.log('signInSilentCallback', user);
    //   this.user$.next(user);
    //   this.router.navigate(['/app/boards-list']);
    // });
  }

  signOut() {
    return this.userManager.signoutRedirect();
  }

  signOutRedirectCallback() {
    return this.userManager.signoutRedirectCallback();
  }
}
