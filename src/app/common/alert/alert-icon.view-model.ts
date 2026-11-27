import type { TranslationKey } from '../../localization/translations/translation-key.enum';

export interface AlertIconViewModel {
	readonly fileName: string;
	readonly translationKey: TranslationKey;
}
