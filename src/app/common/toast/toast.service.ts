import { Injectable } from '@angular/core';
import { Toast } from './toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  readonly defaultDelayMilliseconds: number = 10000;

  showSuccessToast(text: string, delayMilliseconds: number = this.defaultDelayMilliseconds) {
    this.toasts.push({
      text: text,
      class: 'bg-success',
      delayMilliseconds: delayMilliseconds,
    });
  }

  showErrorToast(text: string, delayMilliseconds: number = this.defaultDelayMilliseconds) {
    this.toasts.push({
      text: text,
      class: 'bg-danger',
      delayMilliseconds: delayMilliseconds,
    });
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter(x => x != toast);
  }
}
