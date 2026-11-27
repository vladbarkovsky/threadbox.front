import type { Signal, WritableSignal } from '@angular/core';
import { effect, inject, Service, signal } from '@angular/core';
import { CookieService } from '../common/cookie.service';
import { Theme } from './theme.enum';

@Service()
export class ThemeService {
	private readonly cookieService: CookieService = inject(CookieService);
	private readonly cookieName: string = 'theme';
	private readonly _theme: WritableSignal<Theme> = signal(this.readStoredTheme());

	constructor() {
		effect((): void => {
			document.documentElement.dataset['theme'] = this._theme();
		});
	}

	get theme(): Signal<Theme> {
		return this._theme.asReadonly();
	}

	set theme(theme: Theme) {
		this._theme.set(theme);
		this.cookieService.saveInformationCookie(this.cookieName, theme);
	}

	private readStoredTheme(): Theme {
		const themeValue: string | null = this.cookieService.read(this.cookieName);

		return Object.values(Theme).find((theme: string): theme is Theme => theme === themeValue) ?? Theme.Light;
	}
}
