import { Component, inject } from '@angular/core';
import { Toast } from './toast';
import { ToastService } from './toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoDirective } from '@ngneat/transloco';
import { ToastClassPipe } from './toast-class.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  standalone: true,
  imports: [NgbToast, NgClass, TranslocoDirective, ToastClassPipe],
})
export class ToastComponent {
  private toastService = inject(ToastService);

  readonly delayMilliseconds = 10000;

  get toasts(): Toast[] {
    return this.toastService.toasts;
  }

  removeToast(toast: Toast) {
    this.toastService.removeToast(toast);
  }
}
