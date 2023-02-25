import { FormControl, FormGroup } from '@angular/forms';
import { LoginFormDto } from 'api-client';
import { passwordValidators, userNameValidators } from 'src/app/validator-functions';

export class LoginForm extends FormGroup {
  constructor() {
    super({
      userName: new FormControl('', userNameValidators),
      password: new FormControl('', passwordValidators),
    });
  }

  get userName(): string {
    return this.controls['userName'].value;
  }

  get password(): string {
    return this.controls['password'].value;
  }

  get Dto(): LoginFormDto {
    return new LoginFormDto({
      userName: this.userName,
      password: this.password,
    });
  }
}
