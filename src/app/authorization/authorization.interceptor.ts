import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ToastService } from '../common/toast/toast.service';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private is4Service: AuthorizationService, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.is4Service.user$.pipe(
      switchMap(user => {
        if (user) {
          const clonedRequest = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + user.access_token),
          });

          return next.handle(clonedRequest).pipe(
            tap({
              error: (error: HttpErrorResponse) => {
                switch (error.status) {
                  case HttpStatusCode.Unauthorized:
                    this.is4Service.signOut();
                    break;
                  case HttpStatusCode.Forbidden:
                    this.toastService.showErrorToast("You don't have permissions for this operation.");
                    break;
                }
              },
            })
          );
        }

        return next.handle(request.clone());
      })
    );
  }
}
