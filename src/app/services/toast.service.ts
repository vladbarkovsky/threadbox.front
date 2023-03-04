import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  text: string;
  type: ToastType;
  delayMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  readonly defaultDelayMs: number = 10000;

  success(text: string, delayMs: number = this.defaultDelayMs) {
    this.toasts.push({
      text: text,
      type: 'error',
      delayMs: delayMs,
    });
  }

  error(text: string, delayMs: number = this.defaultDelayMs) {
    this.toasts.push({
      text: text,
      type: 'success',
      delayMs: delayMs,
    });
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(x => x != toast);
  }
}
