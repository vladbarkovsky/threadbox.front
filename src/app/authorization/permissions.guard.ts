// TODO: Can be replaced with NgxPermissionsGuard.
// See https://github.com/AlexKhymenko/ngx-permissions/wiki/Usage-with-routes

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

export const permissionsGuard: CanActivateFn = route => {
  const routePermission = route.data['permission'];

  if (!routePermission) {
    const url = '/' + route.url.map(x => x.path).join('/');
    throw new Error(`No permission specified for guarded route '${url}'.`);
  }

  const permissionsService = inject(NgxPermissionsService);
  const permission = permissionsService.getPermission(routePermission);

  return !!permission;
};
