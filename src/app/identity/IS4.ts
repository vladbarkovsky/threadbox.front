import { Injectable } from '@angular/core';
import { User, UserManager, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IS4 {
  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    redirect_uri: 'http://localhost:4200/is4/redirect-uri',
    response_type: 'code',
    scope: 'openid profile offline_access threadbox_api',
  });

  user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.userManager.getUser().then(user => {
      this.user$.next(user);
    });
  }

  signIn() {
    return this.userManager.signinRedirect();
  }

  signInCallback() {
    return this.userManager.signinRedirectCallback().then(user => {
      console.log(user);
      this.user$.next(user);
    });
  }

  signOut() {
    return this.userManager.signoutRedirectCallback();
  }
}
