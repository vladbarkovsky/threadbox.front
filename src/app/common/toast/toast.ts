import { HashMap } from '@ngneat/transloco';
import { ToastStatus } from './toast-status';

export interface Toast {
  text: string;
  translationParams?: HashMap | undefined;
  status: ToastStatus;
}
