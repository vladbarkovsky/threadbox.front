import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserManager } from 'oidc-client';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { filter, finalize, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { IdentityClient } from '../../../api-client';
import { SessionStorageFacade } from '../common/session-storage-facade';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly identityClient = inject(IdentityClient);
  private readonly permissionsService = inject(NgxPermissionsService);

  get authorized$(): Observable<boolean> {
    return this.user$.pipe(
      filter(x => x !== null),
      map(x => !!x)
    );
  }

  get accessToken$(): Observable<string | undefined> {
    return this.user$.pipe(map(x => x?.access_token));
  }

  get userName$(): Observable<string> {
    return this.user$.pipe(
      filter(x => !!x),
      map(x => x!.profile.name!)
    );
  }

  // undefined means that there are no authorized user.
  // null means that we don't know yet.
  private readonly user$ = new BehaviorSubject<User | undefined | null>(null);

  private readonly userManager = new UserManager({
    authority: environment.apiBaseUrl,
    client_id: 'angular_client',

    // Check Startup.cs on server for more information about commented scope.
    // Search string 'IdentityServerConstants.StandardScopes.OfflineAccess'.
    // offline_access
    scope: 'openid profile threadbox_api.access',

    response_type: 'code',
    redirect_uri: this.document.baseURI + 'authorization/sign-in-redirect-callback',
    silent_redirect_uri: this.document.baseURI + 'assets/authorization/sign-in-silent-callback.html',
    post_logout_redirect_uri: this.document.baseURI + 'authorization/sign-out-redirect-callback',
    automaticSilentRenew: true,
  });

  constructor() {
    // Write OIDC client logs to console.
    // import { Log } from 'oidc-client';
    // Log.logger = console;

    this.userManager.events.addUserLoaded(user => {
      this.log('User loaded.');
      this.setUser(user);
    });

    this.authorized$
      .pipe(
        filter(x => x),
        switchMap(() => this.identityClient.getUserPermissions())
      )
      .subscribe({
        next: permissions => this.permissionsService.loadPermissions(permissions),
        // TODO: Error handling.
        error: error => {},
      });
  }

  checkAuthorization(): void {
    this.user$
      .pipe(
        filter(x => x === null),
        switchMap(() => from(this.userManager.querySessionStatus()))
      )
      .subscribe({
        next: sessionStatus => {
          if (sessionStatus) {
            this.log('Session status received - performing silent sign in...');

            // If we received session status, it means that user is authorized;
            // therefore we perform silent sign in to restore session data.
            // It is necessary for cases when authorized user opens application in new tab
            // or uses offline access (authorization saving after closing the browser).
            this.signInSilent();
          }
        },
        error: () => {
          this.log('Unable to get session status - user is unauthorized.');
          this.setUser(undefined);
        },
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
    from(this.userManager.signinSilent()).subscribe({
      error: error => {
        this.log('Sign in silent error:', error);
        this.setUser(undefined);
      },
    });
  }

  private setUser(user: User | undefined) {
    if (user !== this.user$.value) {
      this.user$.next(user);
    }
  }

  private saveLastUrl(): void {
    const lastUrl = this.location.path();
    this.log('Set last URL:', lastUrl);
    SessionStorageFacade.lastUrl = lastUrl;
  }

  private navigateToLastUrl(): void {
    const lastUrl = SessionStorageFacade.lastUrl;

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
