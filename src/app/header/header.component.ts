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
  authorized$ = this.authorizationService.authorized$;
  links: HeaderLink[] = [];
  activePath!: string;
  isCollapsed: boolean = true;

  constructor(private authorizationService: AuthorizationService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.authorizationService.initialize();

    this.authorized$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => (this.links = x ? linksForUnauthorizedUsers : linksForAuthorizedUsers));

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
