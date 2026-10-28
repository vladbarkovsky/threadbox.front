import type { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { ToastService } from '../common/toast/toast.service';
import { ToastStatus } from '../common/toast/toast-status';
import { TranslationKey } from '../common/localization/translation-key.enum';

export const authorizationInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
	const authorizationService: AuthorizationService = inject(AuthorizationService);
	const toastService: ToastService = inject(ToastService);

	const clonedRequest: HttpRequest<unknown> = request.clone({ withCredentials: true });

	return next(clonedRequest).pipe(
		tap({
			error: (error: HttpErrorResponse): void => {
				switch (error.status as HttpStatusCode) {
					case HttpStatusCode.Unauthorized:
						authorizationService.clearSession();
						break;
					case HttpStatusCode.Forbidden:
						toastService.showToast({
							status: ToastStatus.Warning,
							translationKey: TranslationKey.Authorization_AccessDenied,
						});
						break;
				}
			},
		})
	);
};
