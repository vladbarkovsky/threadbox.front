import { inject } from '@angular/core';
import type { CanMatchFn, UrlTree } from '@angular/router';
import { LocalizationService } from './localization.service';

export const localizeUrlGuard: CanMatchFn = (): UrlTree => {
	const localizationService: LocalizationService = inject(LocalizationService);

	localizationService.synchronizeLanguage();
	return localizationService.localizeUrlTree();
};
