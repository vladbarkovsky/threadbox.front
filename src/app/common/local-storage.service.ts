import { Injectable } from '@angular/core';
import type { Language } from './localization/language.enum';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
	get language(): string | null {
		return localStorage.getItem('language');
	}

	set language(value: Language) {
		localStorage.setItem('language', value);
	}
}
