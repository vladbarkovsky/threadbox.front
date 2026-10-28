import { inject } from '@angular/core';
import type { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { LocalizationService } from './localization.service';

export const supportedLanguageGuard: CanMatchFn = (_route: Route, segments: UrlSegment[]): boolean => {
	const localizationService: LocalizationService = inject(LocalizationService);

	const language: string | undefined = segments[0]?.path;
	return language !== undefined && language !== '' && localizationService.isLanguage(language);
};
