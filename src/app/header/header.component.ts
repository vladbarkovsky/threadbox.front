import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderLink } from './header-link';
import { linksForUnauthorizedUsers, linksForAuthorizedUsers } from './header-links';
import { MemoryLeaksProtectedComponent } from '../common/memory-leaks-protected.component';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../authorization/authorization.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends MemoryLeaksProtectedComponent implements OnInit {
  authorized: boolean | undefined = undefined;
  authorizationStatusReceived = false;
  links: HeaderLink[] = [];
  activePath!: string;
  isCollapsed: boolean = true;

  constructor(private authorizationService: AuthorizationService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.authorizationService.authorized$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.authorizationStatusReceived = true;
      this.authorized = x;
      return (this.links = x ? linksForUnauthorizedUsers : linksForAuthorizedUsers);
    });

    this.authorizationService.initialize();

    // TODO: Describe / refactor
    this.activePath = this.router.url.split('/')[2];
  }

  onLinkClick(linkPath: string): void {
    this.activePath = linkPath;
    this.isCollapsed = true;
  }

  signIn() {
    this.authorizationService.signInRedirect();
  }

  signOut() {
    this.authorizationService.signOutRedirect();
  }
}
