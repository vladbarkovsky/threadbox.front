import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { IdentityService } from 'src/app/identity/identity.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { SignInForm } from './sign-in.form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends MemoryLeaksProtectedComponent {
  loginForm = new SignInForm();

  constructor(private identityService: IdentityService, private toastService: ToastService, private router: Router) {
    super();
  }
}
