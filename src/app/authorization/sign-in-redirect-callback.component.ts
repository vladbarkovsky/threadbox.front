import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class SignInRedirectCallbackComponent implements OnInit {
  constructor(private is4Service: AuthorizationService, private router: Router) {}

  ngOnInit(): void {
    this.is4Service.signInRedirectCallback();
  }
}
