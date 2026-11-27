import { Service } from '@angular/core';

@Service()
export class SessionStorageService {
	get lastUrl(): string | null {
		return sessionStorage.getItem('lastUrl');
	}

	set lastUrl(value: string) {
		sessionStorage.setItem('lastUrl', value);
	}

	removeLastUrl(): void {
		sessionStorage.removeItem('lastUrl');
	}
}
