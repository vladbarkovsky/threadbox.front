import type { InterpolationParameter } from './localization/interpolation-parameter.type';
import type { TranslationKeys } from './localization/translation-keys.enum';

export interface Translatable {
	translationKey: TranslationKeys;
	interpolationParameters?: InterpolationParameter[];
}
