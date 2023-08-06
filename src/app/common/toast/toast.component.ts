import { Component } from '@angular/core';
import { ToastService } from 'src/app/common/toast/toast.service';
import { Toast } from './toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(private toastService: ToastService) {}
  get toasts(): Toast[] {
    return this.toastService.toasts;
  }

  removeToast(toast: Toast) {
    this.toastService.removeToast(toast);
  }
}
