import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-sign-out-redirect-callback',
  template: '',
  standalone: true,
})
export class SignOutRedirectCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.signOutRedirectCallback();
  }
}
