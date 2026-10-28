import { Component, inject } from '@angular/core';
import type { Toast } from './toast';
import { ToastService } from './toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../localization/translate.pipe';
import { ToastClassPipe } from './toast-class.pipe';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	standalone: true,
	imports: [NgbToast, NgClass, TranslatePipe, ToastClassPipe],
})
export class ToastComponent {
	private readonly toastService = inject(ToastService);

	readonly delayMilliseconds = 10000;

	get toasts(): Toast[] {
		return this.toastService.toasts;
	}

	removeToast(toast: Toast): void {
		this.toastService.removeToast(toast);
	}
}
