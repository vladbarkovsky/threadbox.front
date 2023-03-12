import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationClient, RegistrationFormDto } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { MemoryLeaksProtectedComponent } from 'src/app/components/memory-leaks-protected.component';
import { ToastService } from 'src/app/services/toast.service';
import { RegistrationForm } from './registration-form';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends MemoryLeaksProtectedComponent {
  registrationForm = new RegistrationForm();

  constructor(private authenticationClient: AuthenticationClient, private toastService: ToastService, private router: Router) {
    super();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.authenticationClient
        .register(this.registrationForm.registrationFormDto)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            this.toastService.success('Successfully registered.');
            this.router.navigate(['/app/authentication/login']);
          },
          error: x => {
            this.toastService.error('Your registration token is already used or expired.');
          },
        });
    }
  }
}
