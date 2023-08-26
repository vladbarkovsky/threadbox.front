import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  get authorized$(): Observable<boolean> {
    return this.user$.pipe(map(x => !!x && !x.expired));
  }

  get accessToken(): string | undefined {
    return this.user$.value?.access_token ?? undefined;
  }

  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    scope: 'openid profile offline_access threadbox_api',
    response_type: 'code',
    redirect_uri: 'https://localhost:4200/authorization/sign-in-redirect-callback',
    silent_redirect_uri: 'https://localhost:4200/authorization/sign-in-silent-callback',
    post_logout_redirect_uri: 'https://localhost:4200/authorization/sign-out-redirect-callback',
    automaticSilentRenew: true,
  });

  private user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private lastUrl: string = '';

  constructor(private router: Router, private location: Location) {
    Log.logger = console;

    this.userManager.getUser().then(user => {
      this.user$.next(user);
    });

    this.userManager.events.addAccessTokenExpired(() => {
      this.signInSilent();
    });
  }

  signInRedirect(): void {
    this.lastUrl = this.location.path();
    this.userManager.signinRedirect();
  }

  signInRedirectCallback(): void {
    this.userManager.signinRedirectCallback().then(user => {
      this.user$.next(user);
      this.router.navigateByUrl(this.lastUrl);
    });
  }

  signInSilent(): void {
    this.lastUrl = this.location.path();
    this.userManager.signinSilent();
  }

  signInSilentCallback(): void {
    this.userManager.signinSilentCallback().then(user => {
      this.user$.next(user!);
      this.router.navigateByUrl(this.lastUrl);
    });
  }

  signOutRedirect(): void {
    this.lastUrl = this.location.path();
    this.userManager.signoutRedirect();
  }

  signOutRedirectCallback(): void {
    this.userManager.signoutRedirectCallback().then(() => this.router.navigateByUrl(this.lastUrl));
  }
}
