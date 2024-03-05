import { FormGroup, FormControl, Validators } from '@angular/forms';

export class CreatePostForm extends FormGroup {
  get text(): FormControl<string> {
    return this.controls['text'] as FormControl<string>;
  }

  constructor() {
    super({
      text: new FormControl<string>('', [Validators.required, Validators.maxLength(131072)]),
    });
  }
}
