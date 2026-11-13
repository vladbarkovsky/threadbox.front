import type { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import type { Observable } from 'rxjs';

export const languageInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
	const localizationService: LocalizationService = inject(LocalizationService);

	const clonedRequest: HttpRequest<unknown> = request.clone({
		headers: request.headers.set('Accept-Language', localizationService.activeLanguage()),
	});

	return next(clonedRequest);
};
