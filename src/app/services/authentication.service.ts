import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated$ = new BehaviorSubject<boolean>(this.authenticationToken !== '');

  set authenticationToken(value: string) {
    const tokenClaims = jwtDecode(value) as AuthenticationTokenClaims;
    this.cookieService.set('authenticationToken', value, tokenClaims.exp, undefined, undefined, true, undefined);
    this.isAuthenticated$.next(true);
  }

  get authenticationToken(): string {
    return this.cookieService.get('authenticationToken');
  }

  constructor(private cookieService: CookieService, private toastService: ToastService) {
    this.isAuthenticated$.next(this.authenticationToken !== '');
  }

  logout(): void {
    this.cookieService.delete('authenticationToken');
    this.isAuthenticated$.next(false);
    this.toastService.success('Logged out.');
  }
}

interface AuthenticationTokenClaims {
  userId: string;
  exp: number;
}
