import { Injectable } from '@angular/core';
import { Toast } from './toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  showToast(toast: Toast): void {
    this.toasts.push(toast);
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter(x => x !== toast);
  }
}
