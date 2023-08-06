import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdentityService } from './identity.service';
import { ToastService } from '../common/toast/toast.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private identityService: IdentityService, private jwtService: JwtService, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authorized = this.identityService.authorized$.getValue();

    if (!authorized) {
      return next.handle(request.clone());
    }

    const clonedRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + this.jwtService.getAccessToken()),
    });

    return next.handle(clonedRequest).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          switch (error.status) {
            case HttpStatusCode.Unauthorized:
              this.identityService.signOut();
              break;
            case HttpStatusCode.Forbidden:
              this.toastService.showErrorToast("You don't have permissions for this operation.");
              break;
          }
        },
      })
    );
  }
}
