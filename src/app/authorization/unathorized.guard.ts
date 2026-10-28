import type { Signal } from '@angular/core';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { CanActivateFn } from '@angular/router';
import { filter, map, take, type Observable } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { AuthorizationState } from './authorization-state.enum';

export const unauthorizedGuard: CanActivateFn = (): Observable<boolean> => {
	const state: Signal<AuthorizationState> = inject(AuthorizationService).state;

	return toObservable(state).pipe(
		filter((value: AuthorizationState): boolean => value !== AuthorizationState.Unknown),
		map((value: AuthorizationState): boolean => value !== AuthorizationState.Authenticated),
		take(1)
	);
};
