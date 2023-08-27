import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { map } from 'rxjs/operators';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationService) {}

  canActivate() {
    return this.authorizationService.authorized$.pipe(map(x => !x));
  }
}
