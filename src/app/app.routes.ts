import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { applyLanguageGuard } from './common/localization/apply-language.guard';
import { localizeUrlGuard } from './common/localization/localize-url.guard';
import { supportedLanguageGuard } from './common/localization/supported-language.guard';
import type { LayoutComponent } from './layout/layout.component';

export const APP_ROUTES: Routes = [
	{
		canActivate: [applyLanguageGuard],
		canMatch: [supportedLanguageGuard],
		loadComponent: (): Promise<Type<LayoutComponent>> =>
			import('./layout/layout.component').then(
				// eslint-disable-next-line @typescript-eslint/naming-convention -- module export name
				(layoutModule: { LayoutComponent: Type<LayoutComponent> }): Type<LayoutComponent> => layoutModule.LayoutComponent
			),
		path: ':language',
	},
	{
		canMatch: [localizeUrlGuard],
		children: [],
		path: '**',
	},
];
