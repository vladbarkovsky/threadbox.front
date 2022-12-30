import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  set authenticationToken(value: string) {
    const token = jwtDecode(value) as AuthenticationToken;
    this.cookieService.set('authenticationToken', value, token.exp, undefined, undefined, true, undefined);
    this.isAuthenticated$.next(true);
  }

  get authenticationToken(): string {
    return this.cookieService.get('authenticationToken');
  }

  constructor(private cookieService: CookieService) {
    this.isAuthenticated$.next(this.authenticationToken !== '');
  }

  logout(): void {
    this.cookieService.delete('authenticationToken');
    this.isAuthenticated$.next(false);
  }
}

interface AuthenticationToken {
  userId: string;
  exp: number;
}
