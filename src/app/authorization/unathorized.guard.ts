import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { map } from 'rxjs/operators';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  constructor(private is4Service: AuthorizationService) {}

  canActivate() {
    return this.is4Service.authorized$.pipe(map(x => !x));
  }
}
