import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginFormDto, RegistrationFormDto } from 'api-client';
import { matchValidator, passwordValidators, userNameValidators } from 'src/app/validator-functions';

export class RegistrationForm extends FormGroup {
  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
      confirmPassword: new FormControl('', matchValidator('password')),
      registrationToken: new FormControl('', [Validators.required, Validators.pattern('^[\\w-]*\\.[\\w-]*\\.[\\w-]*$')]),
    });
  }

  get userName(): string {
    return this.controls['userName'].value;
  }

  get password(): string {
    return this.controls['password'].value;
  }

  get confirmPassword(): string {
    return this.controls['confirmPassword'].value;
  }

  get registrationToken(): string {
    return this.controls['registrationToken'].value;
  }

  get Dto(): RegistrationFormDto {
    return new RegistrationFormDto({
      userName: this.userName,
      password: this.password,
      confirmPassword: this.password,
      registrationToken: this.registrationToken,
    });
  }

  validateConfirmPassword() {
    this.controls['confirmPassword'].updateValueAndValidity();
  }
}
