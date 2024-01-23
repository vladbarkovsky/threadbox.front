import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-sign-in-redirect-callback',
  template: '',
  standalone: true,
})
export class SignInRedirectCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.signInRedirectCallback();
  }
}
