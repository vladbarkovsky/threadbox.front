import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageFacade } from './common/local-storage-facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ToastComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(language => (LocalStorageFacade.language = language));

    this.processLanguageSegment();
  }

  private processLanguageSegment(): void {
    this.router.events
      .pipe(
        // We need NavigationEnd event, because it has full URL after redirects.
        filter(x => x instanceof NavigationEnd),
        map(x => x as NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const url = event.urlAfterRedirects.split('/').filter(x => x);

        // First URL segment is language code.
        const languageSegment = url[0];

        if (this.translocoService.isLang(languageSegment)) {
          this.translocoService.setActiveLang(languageSegment);
        } else {
          // If we don't know such language, we replace it by saved one or default and navigate,
          // which will bring us back to this subscribe.

          const language = LocalStorageFacade.language ?? this.translocoService.getDefaultLang();
          url[0] = language;
          this.router.navigate(url, { replaceUrl: true });
        }
      });
  }
}
