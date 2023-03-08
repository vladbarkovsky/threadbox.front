import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationClient, LoginFormDto } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent {
  loginForm = new LoginForm();

  constructor(
    private authenticationClient: AuthenticationClient,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private router: Router
  ) {
    super();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authenticationClient
        .login(this.loginForm.loginFormDto)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: x => {
            this.authenticationService.authenticationToken = x;
            this.toastService.success('Successfully logged in.');
            this.router.navigate(['/app/home']);
          },
          error: x => {
            this.toastService.error('Invalid email or password.');
          },
        });
    }
  }
}
