import { Injectable } from '@angular/core';
import { User, UserManager, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IS4 {
  private userManager = new UserManager({
    authority: 'https://localhost:5000',
    client_id: 'angular_client',
    redirect_uri: 'http://localhost:4200',
    response_type: 'code',
    scope: 'openid profile threadbox_api',
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

  // Required?
  signOut() {
    this.userManager.signoutRedirectCallback();
  }
}
