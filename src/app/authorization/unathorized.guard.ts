import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthorizationService } from './authorization.service';

export const unauthorizedGuard: CanActivateFn = () => {
  return inject(AuthorizationService).authorized$.pipe(map(x => !x));
};
