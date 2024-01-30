import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
  navbarCollapsed: boolean = true;

  ngOnInit(): void {
    this.authorizationService.authorize();
  }

  signIn(): void {
    this.authorizationService.signInRedirect();
  }

  signOut(): void {
    this.authorizationService.signOutRedirect();
  }
}
