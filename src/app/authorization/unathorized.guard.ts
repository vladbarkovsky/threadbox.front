import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { CanActivateFn } from '@angular/router';
import { filter, map, take, type Observable } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { AuthorizationState } from './authorization-state.enum';

export const unauthorizedGuard: CanActivateFn = (): Observable<boolean> => {
	const authorizationService: AuthorizationService = inject(AuthorizationService);

	return toObservable(authorizationService.state).pipe(
		filter((state: AuthorizationState): boolean => state !== AuthorizationState.Unknown),
		map((state: AuthorizationState): boolean => state !== AuthorizationState.Authenticated),
		take(1)
	);
};
