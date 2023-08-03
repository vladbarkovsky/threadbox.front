import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  authorized$ = new BehaviorSubject<boolean>(this.jwtService.accessTokenCookieExists);

  constructor(private jwtService: JwtService) {}

  authorize(accessToken: string) {
    this.jwtService.createAccessTokenCookie(accessToken);
    this.authorized$.next(true);
  }

  signOut(): void {
    this.jwtService.deleteAccessTokenFromCookies();
    this.authorized$.next(false);
  }
}
