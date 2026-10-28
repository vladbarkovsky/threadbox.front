import type { InterpolationParameter } from './localization/interpolation-parameter.type';
import type { TranslationKey } from './localization/translation-key.enum';

export interface Translatable {
	translationKey: TranslationKey;
	interpolationParameters?: InterpolationParameter[];
}
