import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { LocalizationService } from './localization.service';

export const applyLanguageGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
	const localizationService: LocalizationService = inject(LocalizationService);
	const language: string | null = route.paramMap.get('language');

	if (language === null || language === '' || !localizationService.isLanguage(language)) {
		return false;
	}

	localizationService.synchronizeLanguage(language);

	return true;
};
