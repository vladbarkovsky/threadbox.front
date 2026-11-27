import type { InputSignal } from '@angular/core';
import { Directive, HostBinding, input } from '@angular/core';

@Directive({
	selector: '[appHourglass]',
})
export class HourglassDirective {
	readonly appHourglass: InputSignal<boolean> = input.required<boolean>();

	@HostBinding('class.hourglass')
	protected get hourglassActive(): boolean {
		return this.appHourglass();
	}

	@HostBinding('attr.aria-busy')
	protected get ariaBusy(): true | null {
		return this.appHourglass() ? true : null;
	}
}
