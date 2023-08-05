import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from 'src/app/identity/identity.service';
import { HeaderLink } from './header-link';
import { linksForUnauthorizedUsers, linksForAuthorizedUsers } from './header-links';
import { MemoryLeaksProtectedComponent } from '../common/memory-leaks-protected.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends MemoryLeaksProtectedComponent implements OnInit {
  links: HeaderLink[] = [];
  activePath!: string;
  isCollapsed: boolean = true;

  authorized$ = this.identityService.authorized$;

  constructor(private identityService: IdentityService, private router: Router) {
    super();
  }

  ngOnInit() {
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

  signOut() {
    this.identityService.signOut();
  }
}
