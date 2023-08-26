import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  template: '',
})
export class SignOutRedirectCallbackComponent implements OnInit {
  constructor(private is4Service: AuthorizationService) {}

  ngOnInit(): void {
    this.is4Service.signOutRedirectCallback();
  }
}
