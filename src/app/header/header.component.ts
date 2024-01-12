import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderLink } from './header-link';
import { linksForUnauthorizedUsers, linksForAuthorizedUsers } from './header-links';
import { AuthorizationService } from '../authorization/authorization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapse],
})
export class HeaderComponent implements OnInit {
  authorized: boolean | undefined = undefined;
  authorizationStatusReceived = false;
  links: HeaderLink[] = [];
  activePath!: string;
  isCollapsed: boolean = true;

  private destroyRef = inject(DestroyRef);

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authorizationService.authorized$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(x => {
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
