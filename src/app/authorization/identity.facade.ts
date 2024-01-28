import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityClient } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class IdentityFacade {
  private readonly identityClient = inject(IdentityClient);

  getUserPermissions(): Observable<string[]> {
    return this.identityClient.getUserPermissions();
  }
}
