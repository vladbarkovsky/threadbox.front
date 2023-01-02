import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationClient, RegistrationFormDto } from 'api-client';
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
        userName: this.registrationForm.controls['userName'].value,
        password: this.registrationForm.controls['password'].value,
        confirmPassword: this.registrationForm.controls['confirmPassword'].value,
        registrationToken: this.registrationForm.controls['registrationToken'].value,
      });

      this.authenticationClient.register(registrationFormDto).subscribe({
        next: () => {
          this.toastService.show({ text: 'Successfully registered.', type: 'success' });
          this.router.navigate(['/app/authentication/login']);
        },
        error: x => {
          this.toastService.show({ text: 'Your registration token is already used or expired.', type: 'danger' });
        },
      });
    }
  }
}
