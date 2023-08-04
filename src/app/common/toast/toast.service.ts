import { Injectable } from '@angular/core';
import { ToastType } from './toast-type';

export interface Toast {
  text: string;
  type: ToastType;
  delayMilliseconds: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  readonly defaultDelayMilliseconds: number = 10000;

  showSuccessToast(text: string, delayMilliseconds: number = this.defaultDelayMilliseconds) {
    this.toasts.push({
      text: text,
      type: 'success',
      delayMilliseconds: delayMilliseconds,
    });
  }

  showErrorToast(text: string, delayMilliseconds: number = this.defaultDelayMilliseconds) {
    this.toasts.push({
      text: text,
      type: 'error',
      delayMilliseconds: delayMilliseconds,
    });
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter(x => x != toast);
  }
}
