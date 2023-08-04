import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { SignInCommand } from 'api-client';
import { GenericFormGroup } from 'src/app/common/generic-form-group';
import { passwordValidators, userNameValidators } from 'src/app/common/validator-functions';

export class SignInForm extends GenericFormGroup<SignInCommand> {
  get data(): SignInCommand {
    return new SignInCommand({
      userName: this.userName.value,
      password: this.password.value,
    });
  }

  get userName(): AbstractControl {
    return this.controls['userName'];
  }

  get password(): AbstractControl {
    return this.controls['password'];
  }

  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
    });
  }
}
