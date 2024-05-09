import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageFacade } from './common/local-storage-facade';
import { APP_ROUTES } from './app.routes';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [ToastComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    const language = LocalStorageFacade.language;

    if (language) {
      this.translocoService.setActiveLang(language);
    }

    this.processLanguageRoutePath();
  }

  private processLanguageRoutePath(): void {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationStart),
        map(x => x as NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const url = new URL(event.url, this.document.baseURI);

        const urlPath = url.pathname.split('/').slice(1);
        const firstSegment = urlPath[0];

        if (firstSegment === this.translocoService.getActiveLang()) {
          return;
        }

        if (this.translocoService.isLang(firstSegment)) {
          this.translocoService.setActiveLang(firstSegment);
          LocalStorageFacade.language = firstSegment;
          return;
        }

        // If we don't know such language code, we check if first segment matches
        // with one of registered route paths.

        const routePaths = APP_ROUTES.find(x => x.path === ':language')!
          .children!.filter(x => x.path && x.path !== '**')!
          .map(x => x.path!);

        const language = LocalStorageFacade.language ?? this.translocoService.getDefaultLang();
        const eventUrl = event.url.split('/').slice(1);

        // If we found matching route, we add language code before it.
        if (routePaths.includes(firstSegment)) {
          eventUrl.unshift(language);
        }
        // Else we replace first segment with language code.
        else {
          eventUrl[0] = language;
        }

        this.router.navigateByUrl('/' + eventUrl.join('/'), { replaceUrl: true });
      });
  }
}
