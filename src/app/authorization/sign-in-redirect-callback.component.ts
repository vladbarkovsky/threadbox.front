import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  template: 'app-sign-in-redirect-callback',
})
export class SignInRedirectCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.signInRedirectCallback();
  }
}
