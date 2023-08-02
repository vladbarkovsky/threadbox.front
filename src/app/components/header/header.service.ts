import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IdentityService } from 'src/app/identity/identity.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  links: HeaderLink[] = [];

  constructor(private authenticationService: IdentityService) {
    this.authenticationService.isAuthenticated$.subscribe(x => {
      this.links = x ? linksForAuthenticatedUser : linksForUnauthenticatedUser;
    });
  }
}

interface HeaderLink {
  title: string;
  path: string;
}

const linksForUnauthenticatedUser: HeaderLink[] = [
  { title: 'Home', path: 'home' },
  { title: 'Authentication', path: 'authentication' },
];

const linksForAuthenticatedUser: HeaderLink[] = [{ title: 'Home', path: 'home' }];
