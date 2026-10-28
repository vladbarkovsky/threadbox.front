import type { Signal, WritableSignal } from '@angular/core';
import { effect, inject, Injectable, signal } from '@angular/core';
import type { UrlCreationOptions, UrlSegment, UrlTree } from '@angular/router';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { enTranslations } from './en-translations';
import { lvTranslations } from './lv-translations';
import { ruTranslations } from './ru-translations';
import type { InterpolationParameter } from './interpolation-parameter.type';
import { Language } from './language.enum';
import type { TranslationKey } from './translation-key.enum';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
	readonly defaultLanguage: Language = Language.English;

	private readonly translations: Record<Language, Record<TranslationKey, string>> = {
		[Language.English]: enTranslations,
		[Language.Latvian]: lvTranslations,
		[Language.Russian]: ruTranslations,
	};

	private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
	private readonly router: Router = inject(Router);

	get activeLanguage(): Signal<Language> {
		return this._activeLanguage.asReadonly();
	}

	private readonly _activeLanguage: WritableSignal<Language> = signal<Language>(this.defaultLanguage);

	constructor() {
		effect((): void => {
			document.documentElement.lang = this._activeLanguage();
		});
	}

	changeLanguage(language: Language): void {
		void this.router.navigateByUrl(this.localizeUrlTree(language), { replaceUrl: true });
	}

	isLanguage(language: string): language is Language {
		return Object.values(Language).includes(language as Language);
	}

	synchronizeLanguage(language?: string): Language {
		if (language !== undefined && this.isLanguage(language)) {
			this._activeLanguage.set(language);
			this.localStorageService.language = language;
			return language;
		}

		const storedLanguage: string | null = this.localStorageService.language;

		if (storedLanguage !== null && this.isLanguage(storedLanguage)) {
			this._activeLanguage.set(storedLanguage);
			return storedLanguage;
		}

		this._activeLanguage.set(this.defaultLanguage);
		this.localStorageService.language = this.defaultLanguage;
		return this.defaultLanguage;
	}

	localizeUrlTree(language?: Language): UrlTree {
		const activeLanguage: Language = language ?? this.activeLanguage();
		const urlTree: UrlTree = this.router.getCurrentNavigation()?.extractedUrl ?? this.router.parseUrl(this.router.url);

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

	translate(key: TranslationKey, interpolationParameters: InterpolationParameter[] = []): string {
		const translations: Record<TranslationKey, string> = this.translations[this._activeLanguage()];
		const template: string = translations[key];

		return this.interpolate(template, interpolationParameters);
	}

	localizeDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
		return new Intl.DateTimeFormat(this.activeLanguage(), options).format(date);
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
