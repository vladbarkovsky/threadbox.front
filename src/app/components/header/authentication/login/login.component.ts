import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationClient, LoginFormDto } from 'api-client';
import { getResponse } from 'src/app/http-error';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { passwordValidators, userNameValidators } from 'src/app/validator-functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    userName: ['', userNameValidators],
    password: ['', passwordValidators],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authenticationClient: AuthenticationClient,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginFormDto = new LoginFormDto({
        userName: this.loginForm.get('userName')?.value,
        password: this.loginForm.get('password')?.value,
      });

      this.authenticationClient.login(loginFormDto).subscribe({
        next: x => {
          this.authenticationService.authenticationToken = x;
          this.toastService.show({ text: 'Successfully logged in.', type: 'success' });
          this.router.navigate(['/app/home']);
        },
        error: x => {
          this.toastService.show({ text: getResponse(x), type: 'danger' });
        },
      });
    }
  }
}
