import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class SignInSilentCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService, private router: Router) {}

  ngOnInit(): void {
    this.authorizationService.signInSilentCallback();
  }
}
