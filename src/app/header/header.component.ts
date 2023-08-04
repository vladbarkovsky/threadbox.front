import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from 'src/app/identity/identity.service';
import { HeaderLink } from './header-link';
import { linksForUnauthorizedUsers, linksForAuthorizedUsers } from './header-links';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  links: HeaderLink[] = [];
  activePath!: string;
  isCollapsed: boolean = true;

  authorized$ = this.identityService.authorized$;

  constructor(private identityService: IdentityService, private router: Router) {}

  ngOnInit() {
    this.authorized$.subscribe(x => {
      this.links = x ? linksForUnauthorizedUsers : linksForAuthorizedUsers;
    });

    // TODO: Describe
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
