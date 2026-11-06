import { Injectable } from '@angular/core';
import type { Toast } from './toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: Toast[] = [];

	showToast(toast: Toast): void {
		this.toasts.push(toast);
	}

	removeToast(toast: Toast): void {
		this.toasts = this.toasts.filter((existingToast: Toast): boolean => existingToast !== toast);
	}
}
