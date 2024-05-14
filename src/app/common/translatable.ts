import { HashMap } from '@ngneat/transloco';

export interface Translatable {
  text: string;
  translationParams?: HashMap | undefined;
}
