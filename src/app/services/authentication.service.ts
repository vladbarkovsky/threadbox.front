import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated$ = new BehaviorSubject<boolean>(this.accessToken !== '');

  set accessToken(value: string) {
    const tokenClaims = jwtDecode(value) as AccessTokenClaims;

    this.cookieService.set(this.accessTokenCookieName, value, tokenClaims.exp, undefined, undefined, true, undefined);

    this.isAuthenticated$.next(true);
  }

  get accessTokenClaims(): AccessTokenClaims {
    return jwtDecode(this.accessToken) as AccessTokenClaims;
  }

  get accessToken(): string {
    return this.cookieService.get(this.accessTokenCookieName);
  }

  private readonly accessTokenCookieName = 'access';

  constructor(private cookieService: CookieService, private toastService: ToastService) {
    this.isAuthenticated$.next(this.accessToken !== '');
  }

  logout(): void {
    this.cookieService.delete(this.accessTokenCookieName);
    this.isAuthenticated$.next(false);
    this.toastService.success('Logged out.');
  }
}

interface AccessTokenClaims {
  exp: number;
}
