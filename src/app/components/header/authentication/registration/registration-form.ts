import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator, passwordValidators, userNameValidators } from 'src/app/validator-functions';

export class RegistrationForm extends FormGroup {
  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
      confirmPassword: new FormControl('', matchValidator('password')),
      registrationToken: new FormControl(''),
    });
  }

  get userName(): AbstractControl {
    return this.controls['userName'];
  }

  get password(): AbstractControl {
    return this.controls['password'];
  }

  get confirmPassword(): AbstractControl {
    return this.controls['confirmPassword'];
  }

  get registrationKeyId(): AbstractControl {
    return this.controls['registrationKeyId'];
  }

  validateConfirmPassword() {
    this.confirmPassword.updateValueAndValidity();
  }
}
