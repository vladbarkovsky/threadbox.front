import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tripcodeStringValidator } from '../../common/validator-functions';

export class CreatePostForm extends FormGroup {
  get text(): FormControl<string> {
    return this.controls['text'] as FormControl<string>;
  }

  get tripcodeString(): FormControl<string> {
    return this.controls['tripcodeString'] as FormControl<string>;
  }

  constructor() {
    super({
      text: new FormControl<string>('', [Validators.required, Validators.maxLength(131072)]),
      tripcodeString: new FormControl<string>('', [tripcodeStringValidator]),
    });
  }
}
