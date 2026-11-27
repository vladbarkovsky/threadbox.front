import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertIcon } from '../../common/alert/alert-icon.enum';
import { AlertComponent } from '../../common/alert/alert.component';
import { AutofocusDirective } from '../../common/directives/autofocus.directive';
import { TranslatePipe } from '../../localization/pipes/translate.pipe';
import { TranslationKey } from '../../localization/translations/translation-key.enum';

@Component({
	selector: 'app-authorization-error',
	templateUrl: './authorization-error.component.html',
	imports: [AlertComponent, AutofocusDirective, TranslatePipe],
})
export class AuthorizationErrorComponent {
	private readonly router: Router = inject(Router);

	protected readonly alertIconEnum: typeof AlertIcon = AlertIcon;
	protected readonly translationKeyEnum: typeof TranslationKey = TranslationKey;

	protected goHome(): void {
		void this.router.navigate(['/']);
	}
}
