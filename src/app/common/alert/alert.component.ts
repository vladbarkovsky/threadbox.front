import type { InputSignal, Signal } from '@angular/core';
import { Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '../../localization/pipes/translate.pipe';
import { TranslationKey } from '../../localization/translations/translation-key.enum';
import { AlertIcon } from './alert-icon.enum';
import type { AlertIconViewModel } from './alert-icon.view-model';
import { WindowComponent } from '../window/window.component';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.css'],
	imports: [NgOptimizedImage, TranslatePipe, WindowComponent],
})
export class AlertComponent {
	private readonly iconViewModels: Record<AlertIcon, AlertIconViewModel> = {
		[AlertIcon.Error]: {
			fileName: 'error32.png',
			translationKey: TranslationKey.Common_Alert_Error,
		},
		[AlertIcon.Warning]: {
			fileName: 'warning32.png',
			translationKey: TranslationKey.Common_Alert_Warning,
		},
		[AlertIcon.Information]: {
			fileName: 'info32.png',
			translationKey: TranslationKey.Common_Alert_Information,
		},
		[AlertIcon.Question]: {
			fileName: 'question32.png',
			translationKey: TranslationKey.Common_Alert_Question,
		},
	};

	readonly icon: InputSignal<AlertIcon> = input.required<AlertIcon>();
	readonly title: InputSignal<string | undefined> = input<string | undefined>();

	protected readonly iconViewModel: Signal<AlertIconViewModel> = computed(
		(): AlertIconViewModel => this.iconViewModels[this.icon()]
	);
}
