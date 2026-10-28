import { inject } from '@angular/core';
import type { CanActivateFn, UrlSegment } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

export const permissionsGuard: CanActivateFn = (route): Promise<boolean> => {
	const routePermission: unknown = route.data['permission'];
	const url = '/' + route.url.map((segment: UrlSegment): string => segment.path).join('/');

	if (typeof routePermission !== 'string') {
		throw new Error(
			`Invalid permission for guarded route '${url}': expected a string, but received ${typeof routePermission}: ${String(
				routePermission
			)}.`
		);
	}

	if (routePermission === '') {
		throw new Error(`No permission specified for guarded route '${url}'.`);
	}

	const permissionsService = inject(NgxPermissionsService);
	return permissionsService.hasPermission(routePermission);
};
