import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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

  get userName(): AbstractControl {
    return this.controls['userName'];
  }

  get password(): AbstractControl {
    return this.controls['password'];
  }

  get confirmPassword(): AbstractControl {
    return this.controls['confirmPassword'];
  }

  get registrationToken(): AbstractControl {
    return this.controls['registrationToken'];
  }

  get registrationFormDto(): RegistrationFormDto {
    return new RegistrationFormDto({
      userName: this.userName.value,
      password: this.password.value,
      confirmPassword: this.password.value,
      registrationToken: this.registrationToken.value,
    });
  }

  validateConfirmPassword() {
    this.confirmPassword.updateValueAndValidity();
  }
}
