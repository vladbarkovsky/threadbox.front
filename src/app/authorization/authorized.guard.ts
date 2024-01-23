import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthorizationService } from './authorization.service';

export const authorizedGuard: CanActivateFn = () => {
  return inject(AuthorizationService).authorized$;
};
