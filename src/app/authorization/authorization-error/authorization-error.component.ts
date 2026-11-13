import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizationService } from '../../localization/localization.service';
import { TranslatePipe } from '../../localization/pipes/translate.pipe';
import { TranslationKeys } from '../../localization/translations/translation-keys.enum';

@Component({
	selector: 'app-authorization-error',
	templateUrl: './authorization-error.component.html',
	imports: [TranslatePipe],
})
export class AuthorizationErrorComponent {
	private readonly router: Router = inject(Router);
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	protected readonly translationKeys: typeof TranslationKeys = TranslationKeys;

	protected goHome(): void {
		void this.router.navigate(['/', this.localizationService.activeLanguage()]);
	}
}
