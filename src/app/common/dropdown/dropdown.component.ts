import type { InputSignal, ModelSignal } from '@angular/core';
import { Component, input, model } from '@angular/core';
import type { DropdownOption } from './dropdown-option';

@Component({
	selector: 'app-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent<TValue> {
	readonly label: InputSignal<string> = input.required<string>();
	readonly options: InputSignal<readonly DropdownOption<TValue>[]> = input.required<readonly DropdownOption<TValue>[]>();
	readonly selectId: InputSignal<string> = input.required<string>();
	readonly value: ModelSignal<TValue> = model.required<TValue>();

	protected changeValue(event: Event): void {
		const target: HTMLSelectElement = event.target as HTMLSelectElement;
		const selectedOption: DropdownOption<TValue> | undefined = this.options()[Number(target.value)];

		if (selectedOption !== undefined) {
			this.value.set(selectedOption.value);
		}
	}
}
