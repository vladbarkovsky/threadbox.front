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
					import('./home/home.component').then(
						// eslint-disable-next-line @typescript-eslint/naming-convention -- module export name
						(homeModule: { HomeComponent: Type<HomeComponent> }): Type<HomeComponent> => homeModule.HomeComponent
					),
				path: 'home',
			},
			{
				loadComponent: (): Promise<Type<BoardComponent>> =>
					import('./board/board.component').then(
						// eslint-disable-next-line @typescript-eslint/naming-convention -- module export name
						(boardModule: { BoardComponent: Type<BoardComponent> }): Type<BoardComponent> => boardModule.BoardComponent
					),
				path: 'board/:boardId',
			},
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{ path: '**', redirectTo: 'home' },
		],
		loadComponent: (): Promise<Type<ShellComponent>> =>
			import('./shell/shell.component').then(
				// eslint-disable-next-line @typescript-eslint/naming-convention -- module export name
				(shellModule: { ShellComponent: Type<ShellComponent> }): Type<ShellComponent> => shellModule.ShellComponent
			),
		path: ':language',
	},
	{
		canMatch: [localizeUrlGuard],
		children: [],
		path: '**',
	},
];
