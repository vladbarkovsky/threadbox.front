import { inject } from '@angular/core';
import type { CanMatchFn, UrlSegment, UrlTree } from '@angular/router';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { LocalizationService } from '../localization.service';

export const localizeUrlGuard: CanMatchFn = (): UrlTree => {
	const localizationService: LocalizationService = inject(LocalizationService);
	const router: Router = inject(Router);

	const urlTree: UrlTree = router.currentNavigation()?.extractedUrl ?? router.parseUrl(router.url);
	const pathSegments: UrlSegment[] = urlTree.root.children[PRIMARY_OUTLET]?.segments ?? [];
	const firstSegment: string | undefined = pathSegments[0]?.path;

	if (firstSegment !== undefined && localizationService.isLanguage(firstSegment)) {
		return router.createUrlTree([firstSegment]);
	}

	localizationService.synchronizeLanguage();
	return localizationService.localizeUrlTree();
};
