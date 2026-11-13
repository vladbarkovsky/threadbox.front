import type { ApplicationConfig } from '@angular/core';
import { importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from '../../api-client';
import { environment } from '../environments/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { authorizationInterceptor } from './authorization/authorization.interceptor';
import { languageInterceptor } from './localization/language.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(APP_ROUTES),
		provideHttpClient(withFetch(), withInterceptors([authorizationInterceptor, languageInterceptor])),
		{ provide: API_BASE_URL, useFactory: (): string => environment.apiBaseUrl },
		importProvidersFrom(NgxPermissionsModule.forRoot()),
	],
};
