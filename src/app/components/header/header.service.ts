import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  links: HeaderLink[] = [];

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.isAuthenticated$.subscribe(x => {
      this.links = x ? linkForAuthenticatedUser : linkForUnauthenticatedUser;
    });
  }
}

interface HeaderLink {
  title: string;
  path: string;
}

const linkForUnauthenticatedUser: HeaderLink[] = [
  { title: 'Home', path: 'home' },
  { title: 'Authentication', path: 'authentication' },
];

const linkForAuthenticatedUser: HeaderLink[] = [{ title: 'Home', path: 'home' }];
