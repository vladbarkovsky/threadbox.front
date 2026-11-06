import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { ToastStatus } from './toast-status';

@Pipe({
	name: 'toastClass',
	standalone: true,
})
export class ToastClassPipe implements PipeTransform {
	transform(value: ToastStatus): string | undefined {
		return this.toastClassMap.get(value);
	}

	private readonly toastClassMap: Map<ToastStatus, string> = new Map<ToastStatus, string>([
		[ToastStatus.Success, 'bg-success'],
		[ToastStatus.Warning, 'bg-warning'],
		[ToastStatus.Error, 'bg-danger'],
	]);
}
