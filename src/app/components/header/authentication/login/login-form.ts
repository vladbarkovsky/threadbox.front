import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LoginFormDto } from 'api-client';
import { passwordValidators, userNameValidators } from 'src/app/validator-functions';

export class LoginForm extends FormGroup {
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

  get loginFormDto(): LoginFormDto {
    return new LoginFormDto({
      userName: this.userName.value,
      password: this.password.value,
    });
  }
}
