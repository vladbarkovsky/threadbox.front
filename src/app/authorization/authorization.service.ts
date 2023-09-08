import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Log, User, UserManager } from 'oidc-client';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  get authorized$(): Observable<boolean> {
    return this.user$.pipe(map(x => !!x));
  }

  user$: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);

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
      console.log('Found session cookie - performing silent sign in...');
      this.signInSilent();
    } else {
      this.user$.next(null);
    }

    this.userManager.events.addUserLoaded(user => {
      console.log('User loaded.');
      this.user$.next(user);
    });
  }

  signInRedirect(): void {
    this.saveLastUrl();
    this.userManager.signinRedirect();
  }

  signInRedirectCallback(): void {
    this.userManager
      .signinRedirectCallback()
      .catch(error => {
        console.log('Sign In redirect callback error:', error.message);
        this.navigateToLastUrl();
      })
      .then(user => {
        this.user$.next(user!);
        this.navigateToLastUrl();
      });
  }

  signInSilentCallback(): void {
    this.userManager.signinSilentCallback().then(user => {
      this.user$.next(user!);
      this.navigateToLastUrl();
    });
  }

  signOutRedirect(): void {
    this.saveLastUrl();
    this.userManager.signoutRedirect();
  }

  signOutRedirectCallback(): void {
    this.userManager.signoutRedirectCallback().then(() => this.navigateToLastUrl());
  }

  private signInSilent(): void {
    this.saveLastUrl();
    this.userManager.signinSilent();
  }

  private saveLastUrl(): void {
    window.sessionStorage.setItem('lastUrl', this.location.path());
  }

  private navigateToLastUrl(): void {
    this.router.navigateByUrl(window.sessionStorage.getItem('lastUrl')!);
  }
}
