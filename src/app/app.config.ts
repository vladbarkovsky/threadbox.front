import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { API_BASE_URL } from '../../api-client';
import { environment } from '../environments/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { authorizationInterceptor } from './authorization/authorization.interceptor';
import { defaultLanguage } from './default-language';
import { languageInterceptor } from './common/localization/language.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([authorizationInterceptor, languageInterceptor])),
    { provide: API_BASE_URL, useFactory: () => environment.apiBaseUrl },
    provideTransloco({
      config: {
        availableLangs: [defaultLanguage, 'lv', 'ru'],
        defaultLang: defaultLanguage,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
  ],
};
