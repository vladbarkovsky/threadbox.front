/* eslint-disable @typescript-eslint/explicit-function-return-type, threadbox/explicit-type */

import type { Routes } from '@angular/router';
import { supportedLanguageGuard } from './localization/guards/supported-language.guard';
import { applyLanguageGuard } from './localization/guards/apply-language.guard';
import { localizeUrlGuard } from './localization/guards/localize-url.guard';

export const APP_ROUTES: Routes = [
	{
		canActivate: [applyLanguageGuard],
		canMatch: [supportedLanguageGuard],
		children: [
			{
				loadComponent: () =>
					import('./authorization/authorization-error/authorization-error.component').then(
						authorizationErrorModule => authorizationErrorModule.AuthorizationErrorComponent
					),
				path: 'authorization-error',
			},
			{
				loadComponent: () =>
					import('./authorization/logged-out/logged-out.component').then(loggedOutModule => loggedOutModule.LoggedOutComponent),
				path: 'logged-out',
			},
			{
				loadComponent: () => import('./layout/layout.component').then(layoutModule => layoutModule.LayoutComponent),
				path: '',
				pathMatch: 'full',
			},
		],
		loadComponent: () =>
			import('./localization/language/language.component').then(languageModule => languageModule.LanguageComponent),
		path: ':language',
	},
	{
		canMatch: [localizeUrlGuard],
		children: [],
		path: '**',
	},
];
