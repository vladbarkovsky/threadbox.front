import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  template: '',
})
export class SignInRedirectCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.signInRedirectCallback();
  }
}
