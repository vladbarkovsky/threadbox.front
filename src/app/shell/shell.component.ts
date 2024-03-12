import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapse, AsyncPipe],
})
export class ShellComponent implements OnInit {
  private readonly authorizationService = inject(AuthorizationService);

  authorized$: Observable<boolean> = this.authorizationService.authorized$;
  userName$: Observable<string> = this.authorizationService.userName$;
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
