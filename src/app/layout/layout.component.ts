import type { OnInit, Signal } from '@angular/core';
import { Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { AuthorizationState } from '../authorization/authorization-state.enum';
import { TranslatePipe } from '../localization/pipes/translate.pipe';
import { Language } from '../localization/language.enum';
import { LocalizationService } from '../localization/localization.service';
import { TranslationKeys as TranslationKey } from '../localization/translations/translation-keys.enum';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	imports: [RouterOutlet, RouterLink, TranslatePipe, UpperCasePipe],
})
export class LayoutComponent implements OnInit {
	private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
	private readonly localizationService: LocalizationService = inject(LocalizationService);

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

	protected readonly translationKey: typeof TranslationKey = TranslationKey;

	ngOnInit(): void {
		this.authorizationService.requestAuthorizationState();
	}

	protected signIn(): void {
		this.authorizationService.executeSignInRedirect();
	}

	protected signOut(): void {
		this.authorizationService.executeSignOutRedirect();
	}

	protected changeLanguage(language: Language): void {
		this.localizationService.changeLanguage(language);
	}
}
