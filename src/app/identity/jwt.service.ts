import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AccessTokenClaims } from './access-token-claims';
import { of } from 'rxjs';
import { delay, first, switchMap } from 'rxjs/operators';
import { IdentityClient } from 'api-client';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly accessTokenCookieName = 'accessToken';

  get accessTokenCookieExists(): boolean {
    return this.cookieService.check(this.accessTokenCookieName);
  }

  constructor(private cookieService: CookieService, private identityClient: IdentityClient) {}

  createAccessTokenCookie(accessToken: string): void {
    const tokenClaims = this.decodeAccessToken(accessToken);
    console.log(tokenClaims.exp);

    this.cookieService.set(this.accessTokenCookieName, accessToken, {
      // Date constructor takes UNIX date in milliseconds, but token exp claim stores it in seconds
      expires: new Date(tokenClaims.exp * 1000),
      // FIXME: Don't work, investigation required
      // path: '/app',
      // domain: document.location.host,
      secure: true,
      sameSite: 'Strict',
    });

    of(undefined)
      .pipe(
        first(),
        delay(30 * 1000),
        switchMap(() => this.identityClient.refreshAccessToken())
      )
      .subscribe({
        next: accessToken => this.createAccessTokenCookie(accessToken),
        error: error => console.log(error),
      });
  }

  getAccessToken(): string | undefined {
    const token = this.cookieService.get(this.accessTokenCookieName);
    return token === '' ? undefined : token;
  }

  deleteAccessToken() {
    this.cookieService.delete(this.accessTokenCookieName);
  }

  private decodeAccessToken(accessToken: string): AccessTokenClaims {
    return jwtDecode(accessToken) as AccessTokenClaims;
  }
}
