import { Component, inject } from '@angular/core';
import { Toast } from './toast';
import { ToastService } from './toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [NgbToast, NgClass],
})
export class ToastComponent {
  private toastService = inject(ToastService);

  get toasts(): Toast[] {
    return this.toastService.toasts;
  }

  removeToast(toast: Toast) {
    this.toastService.removeToast(toast);
  }
}
