import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authorizationService: AuthorizationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authorizationService.authorized$.pipe(
      switchMap(authorized => {
        if (authorized) {
          const clonedRequest = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + this.authorizationService.accessToken),
          });

          return next.handle(clonedRequest).pipe(
            tap({
              error: (error: HttpErrorResponse) => {
                switch (error.status) {
                  case HttpStatusCode.Unauthorized:
                    this.authorizationService.signOutRedirect();
                    break;
                  case HttpStatusCode.Forbidden:
                    console.log('No permissions for operation.');
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
