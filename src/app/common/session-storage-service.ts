import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
	get lastUrl(): string | null {
		return sessionStorage.getItem('lastUrl');
	}

	set lastUrl(value: string) {
		sessionStorage.removeItem('lastUrl');
	}

	removeLastUrl(): void {
		sessionStorage.removeItem('lastUrl');
	}
}
