import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpCommand } from 'api-client';
import { GenericFormGroup } from 'src/app/common/generic-form-group';
import { matchValidator, passwordValidators, userNameValidators } from 'src/app/common/validator-functions';

export class SignUpForm extends GenericFormGroup<SignUpCommand> {
  get data(): SignUpCommand {
    return new SignUpCommand({
      userName: this.userName.value,
      password: this.password.value,
      repeatPassword: this.repeatPassword.value,
      registrationKeyId: this.registrationKeyId.value,
    });
  }

  get userName(): AbstractControl {
    return this.controls['userName'];
  }

  get password(): AbstractControl {
    return this.controls['password'];
  }

  get repeatPassword(): AbstractControl {
    return this.controls['repeatPassword'];
  }

  get registrationKeyId(): AbstractControl {
    return this.controls['registrationKeyId'];
  }

  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
      repeatPassword: new FormControl('', matchValidator('password')),
      registrationToken: new FormControl(''),
    });
  }

  validateRepeatPassword() {
    this.repeatPassword.updateValueAndValidity();
  }
}
