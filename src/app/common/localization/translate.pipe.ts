import type { PipeTransform } from '@angular/core';
import { Pipe, inject } from '@angular/core';
import type { TranslationKey } from './translation-key.enum';
import { LocalizationService } from './localization.service';
import type { InterpolationParameter } from './interpolation-parameter.type';

@Pipe({
	name: 'translate',
	pure: false,
	standalone: true,
})
export class TranslatePipe implements PipeTransform {
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	transform(key: TranslationKey, interpolationParameters?: InterpolationParameter[]): string {
		return this.localizationService.translate(key, interpolationParameters ?? []);
	}
}
