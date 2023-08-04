import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  authorized$ = new BehaviorSubject<boolean>(this.jwtService.accessTokenCookieExists);

  constructor(private jwtService: JwtService, private router: Router) {}

  authorize(accessToken: string) {
    this.jwtService.createAccessTokenCookie(accessToken);
    this.authorized$.next(true);
    this.router.navigate(['/app/home']);
  }

  signOut(): void {
    this.jwtService.deleteAccessTokenFromCookies();
    this.authorized$.next(false);
  }
}
