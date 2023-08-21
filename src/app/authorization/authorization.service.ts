import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    redirect_uri: 'https://localhost:4200/authorization/sign-in-redirect-callback',
    response_type: 'code',
    scope: 'openid profile offline_access threadbox_api',
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://localhost:4200/authorization/sign-in-silent-callback',
  });

  constructor(private router: Router) {
    this.userManager.getUser().then(user => {
      if (user) {
        console.log('ctor got user', user);
        this.user$.next(user);
      } else {
        console.log('ctor trying silent', user);
        this.signInSilent();
      }
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
    return this.userManager.signinSilentCallback().then(user => {
      console.log('signInSilentCallback', user);
      this.user$.next(user);
      this.router.navigate(['/app/boards-list']);
    });
  }

  signOut() {
    return this.userManager.signoutRedirect();
  }
}
