import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-sign-in-silent-callback',
  template: '',
  standalone: true,
})
export class SignInSilentCallbackComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.signInSilentCallback();
  }
}
