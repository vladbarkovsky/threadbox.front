import { Location } from '@angular/common';
import type { Signal, WritableSignal } from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import type { UserSessionDto } from '../../../api-client';
import { UserSessionClient } from '../../../api-client';
import { SessionStorageService } from '../common/session-storage-service';
import { AuthorizationState } from './authorization-state.enum';
import { HttpStatusCode, type HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
	private readonly location: Location = inject(Location);
	private readonly router: Router = inject(Router);
	private readonly userSessionClient: UserSessionClient = inject(UserSessionClient);
	private readonly permissionsService: NgxPermissionsService = inject(NgxPermissionsService);
	private readonly sessionStorageService: SessionStorageService = inject(SessionStorageService);

	private readonly _state: WritableSignal<AuthorizationState> = signal<AuthorizationState>(AuthorizationState.Unknown);
	private readonly _session: WritableSignal<UserSessionDto | undefined> = signal<UserSessionDto | undefined>(undefined);

	get state(): Signal<AuthorizationState> {
		return this._state.asReadonly();
	}

	get session(): Signal<UserSessionDto | undefined> {
		return this._session.asReadonly();
	}

	requestAuthorizationState(): void {
		if (this._state() !== AuthorizationState.Unknown) {
			return;
		}

		this.userSessionClient.get().subscribe({
			next: (session: UserSessionDto): void => {
				this._session.set(session);
				this._state.set(AuthorizationState.Authenticated);
				this.permissionsService.loadPermissions(session.permissions);
				this.navigateToLastUrl();
			},
			// TODO: Handle not 401 - error message, "Try again" button.
			error: (error: HttpErrorResponse): void => {
				if ((error.status as HttpStatusCode) !== HttpStatusCode.Unauthorized) {
					this._session.set(undefined);
					this._state.set(AuthorizationState.Anonymous);
				}

				// eslint-disable-next-line no-console
				console.error(error);
			},
		});
	}

	executeSignInRedirect(): void {
		this.saveLastUrl();
		window.location.href = environment.apiBaseUrl + '/bff/login';
	}

	executeSignOutRedirect(): void {
		this.saveLastUrl();
		this.clearSession();
		window.location.href = environment.apiBaseUrl + '/bff/logout';
	}

	clearSession(): void {
		this.permissionsService.flushPermissions();
		this._session.set(undefined);
		this._state.set(AuthorizationState.Anonymous);
	}

	private saveLastUrl(): void {
		this.sessionStorageService.lastUrl = this.location.path();
	}

	private navigateToLastUrl(): void {
		const lastUrl: string | null = this.sessionStorageService.lastUrl;

		if (lastUrl === null || lastUrl === '') {
			return;
		}

		this.sessionStorageService.removeLastUrl();
		void this.router.navigateByUrl(lastUrl, { replaceUrl: true });
	}
}
