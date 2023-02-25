import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationClient, RegistrationFormDto } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { ToastService } from 'src/app/services/toast.service';
import { RegistrationForm } from './registration-form';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends BaseComponent {
  registrationForm = new RegistrationForm();

  constructor(private authenticationClient: AuthenticationClient, private toastService: ToastService, private router: Router) {
    super();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.authenticationClient
        .register(this.registrationForm.Dto)
        .pipe(takeUntil(this.destruction$))
        .subscribe({
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
