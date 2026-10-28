import { Location } from '@angular/common';
import type { Signal, WritableSignal } from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import type { UserSession } from '../../../api-client';
import { UserSessionClient } from '../../../api-client';
import { SessionStorageService } from '../common/session-storage-service';
import { AuthorizationState } from './authorization-state.enum';
import type { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
	private readonly location: Location = inject(Location);
	private readonly router: Router = inject(Router);
	private readonly userSessionClient: UserSessionClient = inject(UserSessionClient);
	private readonly permissionsService: NgxPermissionsService = inject(NgxPermissionsService);
	private readonly sessionStorageService: SessionStorageService = inject(SessionStorageService);

	private readonly _state: WritableSignal<AuthorizationState> = signal<AuthorizationState>(AuthorizationState.Unknown);
	private readonly _session: WritableSignal<UserSession | undefined> = signal<UserSession | undefined>(undefined);

	get state(): Signal<AuthorizationState> {
		return this._state.asReadonly();
	}

	get session(): Signal<UserSession | undefined> {
		return this._session.asReadonly();
	}

	checkAuthorization(): void {
		if (this._state() !== AuthorizationState.Unknown) {
			return;
		}

		this.userSessionClient.get().subscribe({
			next: (session: UserSession): void => {
				this.setState(AuthorizationState.Authenticated, session);
				this.permissionsService.loadPermissions(session.permissions);
				this.navigateToLastUrl();
			},
			error: (error: HttpErrorResponse): void => {
				this.setState(AuthorizationState.Anonymous);
				console.error(error);
			},
		});
	}

	executeSignInRedirect(): void {
		this.saveLastUrl();
		window.location.href = `${environment.apiBaseUrl}/bff/login`;
	}

	executeSignOutRedirect(): void {
		this.saveLastUrl();
		this.clearSession();
		window.location.href = `${environment.apiBaseUrl}/bff/logout`;
	}

	clearSession(): void {
		this.permissionsService.flushPermissions();
		this.setState(AuthorizationState.Anonymous);
	}

	private setState(state: AuthorizationState, session?: UserSession): void {
		this._session.set(session);
		this._state.set(state);
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
