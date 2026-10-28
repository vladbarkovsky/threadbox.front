import type { PipeTransform } from '@angular/core';
import { inject, Pipe } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
	name: 'localizeDate',
	pure: false,
	standalone: true,
})
export class LocalizeDatePipe implements PipeTransform {
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	transform(date: Date, options?: Intl.DateTimeFormatOptions): string {
		return this.localizationService.localizeDate(date, options);
	}
}
