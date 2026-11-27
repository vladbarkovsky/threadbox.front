import type { InputSignal } from '@angular/core';
import { Component, input } from '@angular/core';

@Component({
	selector: 'app-window',
	templateUrl: './window.component.html',
	styleUrls: ['./window.component.css'],
	host: {
		class: 'window',
	},
})
export class WindowComponent {
	readonly title: InputSignal<string | undefined> = input<string | undefined>();
}
