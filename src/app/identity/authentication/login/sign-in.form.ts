import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { passwordValidators, userNameValidators } from 'src/app/validator-functions';

export class SignInForm extends FormGroup {
  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
    });
  }

  get userName(): AbstractControl {
    return this.controls['userName'];
  }

  get password(): AbstractControl {
    return this.controls['password'];
  }
}
