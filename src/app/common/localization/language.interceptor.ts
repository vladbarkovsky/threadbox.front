import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);

  const clonedReq = req.clone({
    headers: req.headers.set('Accept-Language', translocoService.getActiveLang()),
  });

  return next(clonedReq);
};
