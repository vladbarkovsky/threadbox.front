import { Validators, FormControl, FormGroup } from '@angular/forms';
import type { BoardDto } from '../../../../api-client';
import { UpdateBoardCommand } from '../../../../api-client';

export class UpdateBoardForm extends FormGroup {
	get command(): UpdateBoardCommand {
		return new UpdateBoardCommand({
			id: this.id,
			rowVersion: this.rowVersion,
			title: this.title.value ?? '',
			description: this.description.value ?? '',
		});
	}

	get title(): FormControl<string> {
		return this.controls['title'] as FormControl<string>;
	}

	get description(): FormControl<string> {
		return this.controls['description'] as FormControl<string>;
	}

	private readonly id: string;
	private readonly rowVersion: number;

	constructor(boardDto: BoardDto) {
		super({
			title: new FormControl<string>(boardDto.title, [Validators.required, Validators.maxLength(128)]),
			description: new FormControl<string>(boardDto.description ?? '', [Validators.required, Validators.maxLength(2048)]),
		});

		this.id = boardDto.id;
		this.rowVersion = boardDto.rowVersion;
	}
}
