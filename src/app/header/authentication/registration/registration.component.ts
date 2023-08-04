import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MemoryLeaksProtectedComponent } from 'src/app/common/components/memory-leaks-protected.component';
import { ToastService } from 'src/app/services/toast.service';
import { RegistrationForm } from './registration-form';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends MemoryLeaksProtectedComponent {
  registrationForm = new RegistrationForm();

  constructor(private toastService: ToastService, private router: Router) {
    super();
  }

  onSubmit(): void {}
}
