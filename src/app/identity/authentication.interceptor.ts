import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdentityService } from './identity.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authenticationService: IdentityService, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthenticated = this.authenticationService.isAuthenticated$.getValue();

    if (isAuthenticated) {
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.authenticationService.getAccessTokenFromCookie()),
      });

      return next.handle(clonedRequest).pipe(
        tap({
          error: (error: HttpErrorResponse) => {
            switch (error.status) {
              case HttpStatusCode.Unauthorized:
                this.authenticationService.logout();
                this.toastService.error('You were logged out because of invalid authentication data.');
                break;
              case HttpStatusCode.Forbidden:
                this.toastService.error("You don't have permissions for this operation.");
                break;
            }
          },
        })
      );
    } else {
      return next.handle(request.clone());
    }
  }
}
