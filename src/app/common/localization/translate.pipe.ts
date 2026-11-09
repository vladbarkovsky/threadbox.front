import type { PipeTransform } from '@angular/core';
import { Pipe, inject } from '@angular/core';
import type { TranslationKeys } from './translation-keys.enum';
import { LocalizationService } from './localization.service';
import type { InterpolationParameter } from './interpolation-parameter.type';

@Pipe({
	name: 'translate',
	pure: false,
	standalone: true,
})
export class TranslatePipe implements PipeTransform {
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	transform(key: TranslationKeys, interpolationParameters?: InterpolationParameter[]): string {
		return this.localizationService.translate(key, interpolationParameters ?? []);
	}
}
