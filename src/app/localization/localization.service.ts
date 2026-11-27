import type { Signal, WritableSignal } from '@angular/core';
import { effect, inject, Service, signal } from '@angular/core';
import type { UrlCreationOptions, UrlSegment, UrlTree } from '@angular/router';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { CookieService } from '../common/cookie.service';
import type { InterpolationParameter } from './interpolation-parameter.type';
import { Language } from './language.enum';
import { enTranslations } from './translations/en-translations';
import { lvTranslations } from './translations/lv-translations';
import { ruTranslations } from './translations/ru-translations';
import type { TranslationKey } from './translations/translation-key.enum';

@Service()
export class LocalizationService {
	private readonly defaultLanguage: Language = Language.English;
	private readonly cookieService: CookieService = inject(CookieService);
	private readonly languageCookieName: string = 'language';

	private readonly translations: Record<Language, Record<TranslationKey, string>> = {
		[Language.English]: enTranslations,
		[Language.Latvian]: lvTranslations,
		[Language.Russian]: ruTranslations,
	};

	private readonly router: Router = inject(Router);

	get activeLanguage(): Signal<Language> {
		return this._activeLanguage.asReadonly();
	}

	private readonly _activeLanguage: WritableSignal<Language> = signal<Language>(this.readStoredLanguage());

	constructor() {
		effect((): void => {
			document.documentElement.lang = this._activeLanguage();
		});
	}

	changeLanguage(language: Language): void {
		this._activeLanguage.set(language);
		this.cookieService.saveInformationCookie(this.languageCookieName, language);
		void this.router.navigateByUrl(this.localizeUrlTree(language), { replaceUrl: true });
	}

	isLanguage(language: string): language is Language {
		return Object.values(Language).includes(language as Language);
	}

	synchronizeLanguage(language?: string): Language {
		const activeLanguage: Language = language !== undefined && this.isLanguage(language) ? language : this.readStoredLanguage();

		this._activeLanguage.set(activeLanguage);
		this.cookieService.saveInformationCookie(this.languageCookieName, activeLanguage);
		return activeLanguage;
	}

	localizeUrlTree(language?: Language): UrlTree {
		const activeLanguage: Language = language ?? this.activeLanguage();
		const urlTree: UrlTree = this.router.currentNavigation()?.extractedUrl ?? this.router.parseUrl(this.router.url);

		const pathSegments: string[] =
			urlTree.root.children[PRIMARY_OUTLET]?.segments.map((segment: UrlSegment): string => segment.path) ?? [];

		const currentUrlLanguageSegment: string | undefined = pathSegments[0];

		if (currentUrlLanguageSegment !== undefined && this.isLanguage(currentUrlLanguageSegment)) {
			pathSegments[0] = activeLanguage;
		} else {
			pathSegments.unshift(activeLanguage);
		}

		const urlCreationOptions: UrlCreationOptions = {
			queryParams: urlTree.queryParams,
		};

		if (urlTree.fragment !== null) {
			urlCreationOptions.fragment = urlTree.fragment;
		}

		return this.router.createUrlTree(pathSegments, urlCreationOptions);
	}

	removeLanguageFromUrl(url: string): string {
		const queryIndex: number = url.indexOf('?');
		const query: string = queryIndex === -1 ? '' : url.slice(queryIndex);
		const path: string = queryIndex === -1 ? url : url.slice(0, queryIndex);
		const segments: string[] = path.split('/').filter((segment: string): boolean => segment !== '');
		const firstSegment: string | undefined = segments[0];

		if (firstSegment !== undefined && this.isLanguage(firstSegment)) {
			segments.shift();
		}

		return '/' + segments.join('/') + query;
	}

	translate(key: TranslationKey, interpolationParameters: InterpolationParameter[] = []): string {
		const translations: Record<TranslationKey, string> = this.translations[this._activeLanguage()];
		const template: string = translations[key];

		return this.interpolate(template, interpolationParameters);
	}

	localizeDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
		return new Intl.DateTimeFormat(this.activeLanguage(), options).format(date);
	}

	private readStoredLanguage(): Language {
		return this.readCookieLanguage() ?? this.defaultLanguage;
	}

	private readCookieLanguage(): Language | null {
		const languageValue: string | null = this.cookieService.read(this.languageCookieName);
		return languageValue !== null && this.isLanguage(languageValue) ? languageValue : null;
	}

	private interpolate(template: string, interpolationParameters: InterpolationParameter[]): string {
		// Regex: Matches placeholders in the format "{number}" and captures the number.
		return template.replace(/\{(\d+)\}/g, (placeholder: string, indexDigits: string): string => {
			const parameterIndex: number = Number(indexDigits);

			if (parameterIndex >= interpolationParameters.length) {
				return placeholder;
			}

			const parameter: InterpolationParameter | undefined = interpolationParameters[parameterIndex];
			return parameter === undefined ? placeholder : String(parameter);
		});
	}
}
