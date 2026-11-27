import type { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { AuthorizationService } from './authorization.service';

export const authorizationInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
	const authorizationService: AuthorizationService = inject(AuthorizationService);
	const clonedRequest: HttpRequest<unknown> = request.clone({ withCredentials: true });

	return next(clonedRequest).pipe(
		tap({
			error: (error: HttpErrorResponse): void => {
				if ((error.status as HttpStatusCode) === HttpStatusCode.Unauthorized) {
					authorizationService.clearSession();
				}
			},
		})
	);
};
