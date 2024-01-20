import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Log, User, UserManager } from 'oidc-client';
import { Observable, Subject, from } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  get authorized$(): Observable<boolean> {
    return this._user$.pipe(map(x => !!x));
  }

  get user$(): Observable<User | undefined> {
    return this._user$.asObservable();
  }

  private _user$ = new Subject<User | undefined>();

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
    // Write OIDC client logs to console
    Log.logger = console;

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
        this._user$.next(undefined);
      },
    });

    this.userManager.events.addUserLoaded(user => {
      this.log('User loaded.');
      this._user$.next(user);
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
          this._user$.next(undefined);
        },
      });
  }

  private signInSilent(): void {
    this.saveLastUrl();

    from(this.userManager.signinSilent()).subscribe({
      error: error => {
        this.log('Sign in silent error:', error);
        this._user$.next(undefined);
      },
    });
  }

  signInSilentCallback(): void {
    from(this.userManager.signinSilentCallback())
      .pipe(finalize(() => this.navigateToLastUrl()))
      .subscribe({
        error: error => {
          this.log('Sign in silent callback error:', error.message);
          this._user$.next(undefined);
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
        error: error => this.log('Sign out redirect callback error:', error),
      });
  }

  private saveLastUrl(): void {
    const lastUrl = this.location.path();
    this.log('Set last URL:', lastUrl);
    window.sessionStorage.setItem('lastUrl', lastUrl);
  }

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
