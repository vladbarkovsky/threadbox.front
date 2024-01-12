import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Log, User, UserManager } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
// TODO: Implement methods through RxJS
export class AuthorizationService {
  get authorized$(): Observable<boolean> {
    return this._user$.pipe(
      filter(x => x !== undefined),
      map(x => !!x)
    );
  }

  get user$(): Observable<User | null | undefined> {
    return this._user$.asObservable();
  }

  private _user$ = new BehaviorSubject<User | null | undefined>(undefined);

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private router: Router
  ) {}

  initialize() {
    // Write OIDC client logs to console
    Log.logger = console;

    this.userManager
      .querySessionStatus()
      .catch(() => {
        this.log('Unable to get session status - user is unauthorized');
        this._user$.next(null);
      })
      .then(sessionStatus => {
        if (sessionStatus) {
          this.log('Session status received - performing silent sign in...');

          // If we received session status, it means that user is authorized;
          // therefore we perform silent sign in to restore session data.
          // It is necessary for cases when authorized user opens application in new tab
          // or uses offline access (authorization saving after closing the browser)
          this.signInSilent();
        }
      });

    this.userManager.events.addUserLoaded(user => {
      this.log('User loaded.');
      this._user$.next(user);
    });
  }

  signInRedirect(): void {
    this.saveLastUrl();

    this.userManager.signinRedirect().catch(error => {
      this.log('Sign in redirect error:', error);
    });
  }

  signInRedirectCallback(): void {
    this.userManager
      .signinRedirectCallback()
      .catch(error => {
        this.log('Sign in redirect callback error:', error.message);
        this._user$.next(null);
      })
      .finally(() => this.navigateToLastUrl());
  }

  private signInSilent(): void {
    this.saveLastUrl();

    this.userManager.signinSilent().catch(error => {
      this.log('Sign in silent error:', error);
      this._user$.next(null);
    });
  }

  signInSilentCallback(): void {
    this.userManager
      .signinSilentCallback()
      .catch(error => {
        this.log('Sign in silent callback error:', error.message);
        this._user$.next(null);
      })
      .finally(() => this.navigateToLastUrl());
  }

  signOutRedirect(): void {
    this.saveLastUrl();

    this.userManager.signoutRedirect().catch(error => this.log('Sign out redirect error:', error.message));
  }

  signOutRedirectCallback(): void {
    this.userManager
      .signoutRedirectCallback()
      .catch(error => this.log('Sign out redirect callback error:', error))
      .finally(() => this.navigateToLastUrl());
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
