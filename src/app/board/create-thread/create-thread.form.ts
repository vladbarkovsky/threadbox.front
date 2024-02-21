import { FormControl, FormGroup, Validators } from '@angular/forms';

export class CreateThreadForm extends FormGroup {
  get title(): FormControl<string> {
    return this.controls['title'] as FormControl<string>;
  }

  get text(): FormControl<string> {
    return this.controls['text'] as FormControl<string>;
  }

  get threadImages(): FormControl<File[]> {
    return this.controls['threadImages'] as FormControl<File[]>;
  }

  readonly boardId: string;

  constructor(boardId: string) {
    super({
      title: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
      text: new FormControl<string>('', [Validators.required, Validators.maxLength(131072)]),
      threadImages: new FormControl<File[]>([], [Validators.maxLength(5)]),
    });

    this.boardId = boardId;
  }
}
