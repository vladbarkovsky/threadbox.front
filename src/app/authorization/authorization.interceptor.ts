import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { AuthorizationService } from './authorization.service';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizationService = inject(AuthorizationService);

  return authorizationService.token$.pipe(
    switchMap(token => {
      if (!token) {
        return next(req.clone());
      }

      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });

      return next(clonedReq).pipe(
        tap({
          error: (error: HttpErrorResponse) => {
            switch (error.status) {
              case HttpStatusCode.Unauthorized:
                authorizationService.signOutRedirect();
                break;
              case HttpStatusCode.Forbidden:
                console.log('No permissions for operation.');
                break;
            }
          },
        })
      );
    })
  );
};
