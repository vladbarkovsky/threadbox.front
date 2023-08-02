import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly accessTokenCookieName = 'accessToken';

  get accessTokenExpiresSoon(): boolean {
    return this.getAccessTokenFromCookie();
  }

  isAuthenticated$ = new BehaviorSubject<boolean>(this.getAccessTokenFromCookie() !== '');

  constructor(private cookieService: CookieService, private toastService: ToastService) {
    this.isAuthenticated$.next(this.accessToken !== '');
  }

  createAccessTokenCookie(accessToken: string) {
    const tokenClaims = jwtDecode(accessToken) as AccessTokenClaims;
    this.cookieService.set(this.accessTokenCookieName, accessToken, tokenClaims.exp, undefined, undefined, true, undefined);
    this.isAuthenticated$.next(true);
  }

  getAccessTokenFromCookie(): string | undefined {
    return this.cookieService.get(this.accessTokenCookieName);
  }

  logout(): void {
    this.cookieService.delete(this.accessTokenCookieName);
    this.isAuthenticated$.next(false);
    this.toastService.success('Logged out.');
  }

  private decodeAccessToken(accessToken: string): AccessTokenClaims {
    return jwtDecode(accessToken) as AccessTokenClaims;
  }
}

interface AccessTokenClaims {
  exp: number;
}
