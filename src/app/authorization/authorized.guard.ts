import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private is4Service: AuthorizationService) {}

  canActivate() {
    return this.is4Service.authorized$;
  }
}
