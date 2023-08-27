import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationService) {}

  canActivate() {
    return this.authorizationService.authorized$;
  }
}
