import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import type { BoardComponent } from './board/board.component';
import { applyLanguageGuard } from './common/localization/apply-language.guard';
import { localizeUrlGuard } from './common/localization/localize-url.guard';
import { supportedLanguageGuard } from './common/localization/supported-language.guard';
import type { HomeComponent } from './home/home.component';
import type { ShellComponent } from './shell/shell.component';

export const APP_ROUTES: Routes = [
	{
		canActivate: [applyLanguageGuard],
		canMatch: [supportedLanguageGuard],
		children: [
			{
				loadComponent: (): Promise<Type<HomeComponent>> =>
					import('./home/home.component').then((module): Type<HomeComponent> => module.HomeComponent),
				path: 'home',
			},
			{
				loadComponent: (): Promise<Type<BoardComponent>> =>
					import('./board/board.component').then((module): Type<BoardComponent> => module.BoardComponent),
				path: 'board/:boardId',
			},
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{ path: '**', redirectTo: 'home' },
		],
		loadComponent: (): Promise<Type<ShellComponent>> =>
			import('./shell/shell.component').then((module): Type<ShellComponent> => module.ShellComponent),
		path: ':language',
	},
	{
		canMatch: [localizeUrlGuard],
		children: [],
		path: '**',
	},
];
