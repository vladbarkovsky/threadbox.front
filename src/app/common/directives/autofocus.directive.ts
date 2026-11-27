import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
	selector: '[appAutofocus]',
})
export class AutofocusDirective {
	private readonly hostElement: ElementRef<HTMLElement> = inject(ElementRef);

	constructor() {
		afterNextRender({
			write: (): void => {
				this.hostElement.nativeElement.focus();
			},
		});
	}
}
