import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tripcodeStringValidator } from '../../common/validator-functions';

export class CreateThreadForm extends FormGroup {
  get title(): FormControl<string> {
    return this.controls['title'] as FormControl<string>;
  }

  get text(): FormControl<string> {
    return this.controls['text'] as FormControl<string>;
  }

  get tripcodeString(): FormControl<string> {
    return this.controls['tripcodeString'] as FormControl<string>;
  }

  constructor() {
    super({
      title: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
      text: new FormControl<string>('', [Validators.required, Validators.maxLength(131072)]),
      tripcodeString: new FormControl<string>('', [tripcodeStringValidator]),
    });
  }
}
