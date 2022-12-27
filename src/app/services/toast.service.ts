import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'danger';

export interface Toast {
  text: string;
  type?: ToastType;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
