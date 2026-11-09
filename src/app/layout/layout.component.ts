import type { OnInit, Signal } from '@angular/core';
import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { AuthorizationState } from '../authorization/authorization-state.enum';
import { Language } from '../common/localization/language.enum';
import { LocalizationService } from '../common/localization/localization.service';
import { TranslatePipe } from '../common/localization/translate.pipe';
import { TranslationKeys } from '../common/localization/translation-keys.enum';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [RouterOutlet, RouterLink, TranslatePipe, UpperCasePipe],
})
export class LayoutComponent implements OnInit {
	private readonly authorizationService: AuthorizationService = inject(AuthorizationService);
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	state: Signal<AuthorizationState> = this.authorizationService.state;
	userName: Signal<string | undefined> = computed((): string | undefined => this.authorizationService.session()?.username);
	readonly authorizationState: typeof AuthorizationState = AuthorizationState;
	protected activeLanguage: Signal<Language> = this.localizationService.activeLanguage;
	protected availableLanguages: Language[] = Object.values(Language);

	languageDisplayNames: Record<Language, string> = {
		[Language.English]: 'EN',
		[Language.Latvian]: 'LV',
		[Language.Russian]: 'RU',
	};

	readonly translationKey: typeof TranslationKeys = TranslationKeys;

	ngOnInit(): void {
		this.authorizationService.requestAuthorizationState();
	}

	signIn(): void {
		this.authorizationService.executeSignInRedirect();
	}

	signOut(): void {
		this.authorizationService.executeSignOutRedirect();
	}

	changeLanguage(language: Language): void {
		this.localizationService.changeLanguage(language);
	}
}
