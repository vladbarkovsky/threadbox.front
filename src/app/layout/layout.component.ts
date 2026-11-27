import type { OnInit, Signal, WritableSignal } from '@angular/core';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { AuthorizationState } from '../authorization/authorization-state.enum';
import { TranslatePipe } from '../localization/pipes/translate.pipe';
import { Language } from '../localization/language.enum';
import { LocalizationService } from '../localization/localization.service';
import { TranslationKey } from '../localization/translations/translation-key.enum';
import { NgOptimizedImage } from '@angular/common';
import { DropdownComponent } from '../common/dropdown/dropdown.component';
import type { DropdownOption } from '../common/dropdown/dropdown-option';
import { ThemeService } from '../theme/theme.service';
import { Theme } from '../theme/theme.enum';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.css'],
	imports: [DropdownComponent, NgOptimizedImage, RouterLink, RouterOutlet, TranslatePipe],
})
export class LayoutComponent implements OnInit {
	private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
	private readonly localizationService: LocalizationService = inject(LocalizationService);
	private readonly themeService: ThemeService = inject(ThemeService);

	protected readonly authorizationState: Signal<AuthorizationState> = this.authorizationService.state;
	protected readonly authorizationStateEnum: typeof AuthorizationState = AuthorizationState;

	protected readonly userName: Signal<string | undefined> = computed(
		(): string | undefined => this.authorizationService.session()?.username
	);

	protected readonly activeLanguage: Signal<Language> = this.localizationService.activeLanguage;
	protected readonly availableLanguages: Language[] = Object.values(Language);

	protected readonly languageDisplayNames: Record<Language, string> = {
		[Language.English]: 'EN',
		[Language.Latvian]: 'LV',
		[Language.Russian]: 'RU',
	};
	protected readonly languageOptions: readonly DropdownOption<Language>[] = this.availableLanguages.map(
		(language: Language): DropdownOption<Language> => ({
			value: language,
			label: this.languageDisplayNames[language],
		})
	);

	protected readonly translationKeyEnum: typeof TranslationKey = TranslationKey;
	protected readonly menuOpen: WritableSignal<boolean> = signal(false);
	protected readonly themeEnum: typeof Theme = Theme;
	protected readonly theme: Signal<Theme> = this.themeService.theme;

	ngOnInit(): void {
		this.authorizationService.requestAuthorizationState();
	}

	protected signIn(): void {
		this.authorizationService.executeSignInRedirect();
	}

	protected signOut(): void {
		this.authorizationService.executeSignOutRedirect();
	}

	protected selectLanguage(language: Language): void {
		this.localizationService.changeLanguage(language);
	}

	protected selectDarkTheme(event: Event): void {
		const checkbox: EventTarget | null = event.target;

		if (!(checkbox instanceof HTMLInputElement)) {
			return;
		}

		this.themeService.theme = checkbox.checked ? Theme.Dark : Theme.Light;
	}

	protected toggleMenu(): void {
		this.menuOpen.update((open: boolean): boolean => !open);
	}
}
