import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationClient, RegistrationFormDto } from 'api-client';
import { getResponse } from 'src/app/http-error';
import { ToastService } from 'src/app/services/toast.service';
import { userNameValidators, passwordValidators, matchValidator } from 'src/app/validator-functions';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm = this.formBuilder.group({
    userName: ['', userNameValidators],
    password: ['', passwordValidators],
    confirmPassword: ['', matchValidator('password')],
    registrationToken: ['', [Validators.required, Validators.pattern('^[\\w-]*\\.[\\w-]*\\.[\\w-]*$')]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authenticationClient: AuthenticationClient,
    private toastService: ToastService,
    private router: Router
  ) {}

  validateConfirmPassword() {
    this.registrationForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const registrationFormDto = new RegistrationFormDto({
        userName: this.registrationForm.get('userName')?.value,
        password: this.registrationForm.get('password')?.value,
        confirmPassword: this.registrationForm.get('confirmPassword')?.value,
        registrationToken: this.registrationForm.get('registrationToken')?.value,
      });

      this.authenticationClient.register(registrationFormDto).subscribe({
        next: () => {
          this.toastService.show({ text: 'Successfully registered.', type: 'success' });
          this.router.navigate(['/app/authentication/login']);
        },
        error: x => {
          this.toastService.show({ text: getResponse(x), type: 'danger' });
        },
      });
    }
  }
}
