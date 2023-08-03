import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { IdentityService } from './identity.service';
import { ToastService } from '../services/toast.service';
import { IdentityClient } from 'api-client';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private recursionLock = false;

  constructor(
    private identityService: IdentityService,
    private jwtService: JwtService,
    private identityClient: IdentityClient,
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authorized = this.identityService.authorized$.getValue();

    if (authorized) {
      if (this.jwtService.accessTokenExpiresSoon && !this.recursionLock) {
        this.recursionLock = true;
        return this.identityClient.refreshAccessToken().pipe(
          first(),
          switchMap(accessToken => {
            this.identityService.authorize(accessToken);
            this.recursionLock = false;
            return this.sendAuthorizedRequest(request, next);
          })
        );
      }

      return this.sendAuthorizedRequest(request, next);
    }

    return next.handle(request.clone());
  }

  private sendAuthorizedRequest(request: HttpRequest<unknown>, next: HttpHandler) {
    const clonedRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + this.jwtService.getAccessTokenFromCookie()),
    });

    return next.handle(clonedRequest).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          switch (error.status) {
            case HttpStatusCode.Unauthorized:
              this.identityService.signOut();
              break;
            case HttpStatusCode.Forbidden:
              this.toastService.error("You don't have permissions for this operation.");
              break;
          }
        },
      })
    );
  }
}
