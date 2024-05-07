import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { ToastService } from '../common/toast/toast.service';
import { ToastStatus } from '../common/toast/toast-status';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizationService = inject(AuthorizationService);
  const toastService = inject(ToastService);

  return authorizationService.accessToken$.pipe(
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
                // TODO: Redirect to page 403.
                toastService.showToast({ text: 'AUTHORIZATION.ACCESS_DENIED', status: ToastStatus.Warning });
                break;
            }
          },
        })
      );
    })
  );
};
