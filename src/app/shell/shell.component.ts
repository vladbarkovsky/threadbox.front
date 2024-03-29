import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { NgbCollapse, NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapse, AsyncPipe, TranslocoPipe, NgbDropdownModule, UpperCasePipe],
})
export class ShellComponent implements OnInit {
  private readonly authorizationService = inject(AuthorizationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  navbarCollapsed: boolean = true;

  authorized$: Observable<boolean> = this.authorizationService.authorized$;
  userName$: Observable<string> = this.authorizationService.userName$;

  // TODO: Store last selected language in database for authorized users.
  selectedLanguage: string = this.translocoService.getActiveLang();

  availableLanguages = this.translocoService.getAvailableLangs() as string[];

  ngOnInit(): void {
    this.authorizationService.authorize();

    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(language => (this.selectedLanguage = language));
  }

  signIn(): void {
    this.authorizationService.signInRedirect();
  }

  signOut(): void {
    this.authorizationService.signOutRedirect();
  }

  changeLanguage(language: string): void {
    this.translocoService.setActiveLang(language);
  }
}
