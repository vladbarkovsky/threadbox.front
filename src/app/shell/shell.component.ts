import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapse, AsyncPipe, TranslocoDirective, NgbDropdownModule, UpperCasePipe],
})
export class ShellComponent implements OnInit {
  private readonly authorizationService = inject(AuthorizationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  navbarCollapsed: boolean = true;

  authorized$: Observable<boolean> = this.authorizationService.authorized$;
  userName$: Observable<string> = this.authorizationService.userName$;
  selectedLanguage: string = this.translocoService.getActiveLang();

  availableLanguages = this.translocoService.getAvailableLangs() as string[];

  ngOnInit(): void {
    this.authorizationService.checkAuthorization();

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
    const url = this.router.url.split('/').filter(x => x);

    // First URL segment is language code.
    url[0] = language;

    this.router.navigateByUrl(url.join('/'), { replaceUrl: true });
  }
}
