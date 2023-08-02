import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryLeaksProtectedComponent } from 'src/app/components/memory-leaks-protected.component';
import { IdentityService } from 'src/app/identity/identity.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends MemoryLeaksProtectedComponent {
  loginForm = new LoginForm();

  constructor(private authenticationService: IdentityService, private toastService: ToastService, private router: Router) {
    super();
  }
}
