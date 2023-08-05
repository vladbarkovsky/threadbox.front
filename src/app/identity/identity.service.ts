import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  authorized$ = new BehaviorSubject<boolean>(false);

  constructor(private jwtService: JwtService, private router: Router) {
    this.authorized$.next(this.jwtService.accessTokenCookieExists);
  }

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
