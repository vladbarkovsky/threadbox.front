import { Pipe, PipeTransform } from '@angular/core';
import { ToastStatus } from './toast-status';

@Pipe({
  name: 'toastClass',
  standalone: true,
})
export class ToastClassPipe implements PipeTransform {
  transform(value: ToastStatus) {
    return this.toastClassMap.get(value);
  }

  private readonly toastClassMap = new Map<ToastStatus, string>([
    [ToastStatus.Success, 'bg-success'],
    [ToastStatus.Warning, 'bg-warning'],
    [ToastStatus.Error, 'bg-danger'],
  ]);
}
