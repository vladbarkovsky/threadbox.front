import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Log, User, UserManager } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
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
    scope: 'openid profile offline_access threadbox_api.access',
    response_type: 'code',
    redirect_uri: this.document.baseURI + 'authorization/sign-in-redirect-callback',
    silent_redirect_uri: this.document.baseURI + 'authorization/sign-in-silent-callback',
    post_logout_redirect_uri: this.document.baseURI + 'authorization/sign-out-redirect-callback',
    automaticSilentRenew: true,
  });

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private router: Router,
    private cookieService: CookieService
  ) {}

  initialize() {
    // Write OIDC client logs to console
    Log.logger = console;

    const sessionCookieExists = this.cookieService.check('idsrv.session');

    if (sessionCookieExists) {
      this.log('Session cookie detected - performing silent sign in...');
      this.signInSilent();
    } else {
      this.log('Session cookie not found - user is unauthorized.');
      this._user$.next(null);
    }

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
