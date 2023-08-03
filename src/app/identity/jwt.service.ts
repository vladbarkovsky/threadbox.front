import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AccessTokenClaims } from './access-token-claims';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly accessTokenCookieName = 'accessToken';

  get accessTokenCookieExists(): boolean {
    return this.cookieService.check(this.accessTokenCookieName);
  }

  get accessTokenExpiresSoon(): boolean | undefined {
    if (!this.accessTokenCookieExists) {
      return;
    }

    const token = this.getAccessTokenFromCookie()!;
    const difference = new Date().getTime() - this.decodeAccessToken(token).exp;
    return difference < 2 * 60 * 1000;
  }

  constructor(private cookieService: CookieService) {}

  createAccessTokenCookie(accessToken: string): void {
    const tokenClaims = this.decodeAccessToken(accessToken);

    this.cookieService.set(this.accessTokenCookieName, accessToken, {
      expires: tokenClaims.exp,
      path: '/app',
      domain: document.location.origin,
      secure: true,
      sameSite: 'Strict',
    });
  }

  getAccessTokenFromCookie(): string | undefined {
    const token = this.cookieService.get(this.accessTokenCookieName);
    return token === '' ? undefined : token;
  }

  deleteAccessTokenFromCookies(): void {
    this.cookieService.delete(this.accessTokenCookieName);
  }

  private decodeAccessToken(accessToken: string): AccessTokenClaims {
    return jwtDecode(accessToken) as AccessTokenClaims;
  }
}
