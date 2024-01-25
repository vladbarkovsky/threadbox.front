import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserManager } from 'oidc-client';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { filter, finalize, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { IdentityFacade } from './identity.facade';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly identityFacade = inject(IdentityFacade);
  private readonly permissionsService = inject(NgxPermissionsService);

  get authorized$(): Observable<boolean> {
    return this._user$.pipe(
      filter(x => x !== null),
      map(x => !!x)
    );
  }

  get token$(): Observable<string | undefined> {
    return this._user$.pipe(map(x => x?.access_token));
  }

  // undefined means that there are no authorized user.
  // null means that we don't know yet.
  private readonly _user$ = new BehaviorSubject<User | undefined | null>(null);

  private userManager = new UserManager({
    authority: environment.apiBaseUrl,
    client_id: 'angular_client',
    scope: 'openid profile threadbox_api.access',
    response_type: 'code',
    redirect_uri: this.document.baseURI + 'authorization/sign-in-redirect-callback',
    silent_redirect_uri: this.document.baseURI + 'assets/authorization/sign-in-silent-callback.html',
    post_logout_redirect_uri: this.document.baseURI + 'authorization/sign-out-redirect-callback',
    automaticSilentRenew: true,
  });

  initialize() {
    this.authorized$
      .pipe(
        filter(x => x),
        switchMap(() => this.identityFacade.getUserPermissions())
      )
      .subscribe(permissions => {
        this.permissionsService.loadPermissions(permissions);
      });

    // Write OIDC client logs to console
    // import { Log } from 'oidc-client';
    // Log.logger = console;

    from(this.userManager.querySessionStatus()).subscribe({
      next: sessionStatus => {
        if (sessionStatus) {
          this.log('Session status received - performing silent sign in...');

          // If we received session status, it means that user is authorized;
          // therefore we perform silent sign in to restore session data.
          // It is necessary for cases when authorized user opens application in new tab
          // or uses offline access (authorization saving after closing the browser)
          this.signInSilent();
        }
      },
      error: () => {
        this.log('Unable to get session status - user is unauthorized.');
        this.setUser(undefined);
      },
    });

    this.userManager.events.addUserLoaded(user => {
      this.log('User loaded.');
      this.setUser(user);
    });
  }

  signInRedirect(): void {
    this.saveLastUrl();

    from(this.userManager.signinRedirect()).subscribe({
      error: error => this.log('Sign in redirect error:', error),
    });
  }

  signInRedirectCallback(): void {
    from(this.userManager.signinRedirectCallback())
      .pipe(finalize(() => this.navigateToLastUrl()))
      .subscribe({
        error: error => {
          this.log('Sign in redirect callback error:', error.message);
          this.setUser(undefined);
        },
      });
  }

  signOutRedirect(): void {
    this.saveLastUrl();

    from(this.userManager.signoutRedirect()).subscribe({
      error: error => this.log('Sign out redirect error:', error.message),
    });
  }

  signOutRedirectCallback(): void {
    from(this.userManager.signoutRedirectCallback())
      .pipe(finalize(() => this.navigateToLastUrl()))
      .subscribe({
        next: () => this.permissionsService.flushPermissions(),
        error: error => this.log('Sign out redirect callback error:', error),
      });
  }

  private signInSilent(): void {
    this.saveLastUrl();

    from(this.userManager.signinSilent()).subscribe({
      error: error => {
        this.log('Sign in silent error:', error);
        this.setUser(undefined);
      },
    });
  }

  private setUser(user: User | undefined) {
    if (user !== this._user$.value) {
      this._user$.next(user);
    }
  }

  // TODO: Last URL service?
  private saveLastUrl(): void {
    const lastUrl = this.location.path();
    this.log('Set last URL:', lastUrl);
    window.sessionStorage.setItem('lastUrl', lastUrl);
  }

  // TODO: Last URL service?
  private navigateToLastUrl(): void {
    const lastUrl = window.sessionStorage.getItem('lastUrl');

    if (!lastUrl) {
      this.log('Last URL not found - unable to perform redirect.');
      return;
    }

    this.log('Performing redirect to the last URL:', lastUrl);
    this.router.navigateByUrl(lastUrl);
  }

  private log(message?: any, ...optionalParams: any[]): void {
    console.log(`[AUTH] ${message}`, ...optionalParams);
  }
}
