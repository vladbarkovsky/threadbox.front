import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderLink } from './header-link';
import { linksForUnauthorizedUsers, linksForAuthorizedUsers } from './header-links';
import { AuthorizationService } from '../authorization/authorization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapse, AsyncPipe],
})
export class ShellComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly router = inject(Router);

  authorized$ = this.authorizationService.authorized$;

  links: HeaderLink[] = [];
  activePath = '';
  headerCollapsed: boolean = true;

  ngOnInit(): void {
    this.authorizationService.authorized$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(authorized => {
      this.links = authorized ? linksForUnauthorizedUsers : linksForAuthorizedUsers;
    });

    this.authorizationService.initialize();

    // TODO: Describe / refactor
    this.activePath = this.router.url.split('/')[2];
  }

  onLinkClick(linkPath: string): void {
    this.activePath = linkPath;
    this.headerCollapsed = true;
  }

  signIn(): void {
    this.authorizationService.signInRedirect();
  }

  signOut(): void {
    this.authorizationService.signOutRedirect();
  }
}
