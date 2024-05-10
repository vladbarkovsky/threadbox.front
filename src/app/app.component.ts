import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { NavigationStart, PRIMARY_OUTLET, Router, RouterOutlet, UrlSerializer } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageFacade } from './common/local-storage-facade';
import { APP_ROUTES } from './app.routes';

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
  private readonly urlSerializer = inject(UrlSerializer);

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
        // We need to get first URL path segment without anything else like query params or fragments.
        // See: https://angular.io/api/router/UrlTree#usage-notes
        const firstPathSegment = this.urlSerializer.parse(event.url).root.children[PRIMARY_OUTLET].segments[0].path;

        if (firstPathSegment === this.translocoService.getActiveLang()) {
          return;
        }

        if (this.translocoService.isLang(firstPathSegment)) {
          this.translocoService.setActiveLang(firstPathSegment);
          LocalStorageFacade.language = firstPathSegment;
          return;
        }

        // If we don't know such language code, we will check if first path segment matches
        // with one of registered route paths.

        const routePaths = APP_ROUTES.find(x => x.path === ':language')!
          .children!.filter(x => x.path && x.path !== '**')!
          .map(x => x.path!);

        const language = LocalStorageFacade.language ?? this.translocoService.getDefaultLang();

        // We will modify raw URL with query params, fragments, etc. and paste it all to router.
        const eventUrl = event.url.split('/').slice(1);

        // If we found matching route path, we add language code before.
        if (routePaths.includes(firstPathSegment)) {
          eventUrl.unshift(language);
        }
        // Else we replace first path segment with language code.
        else {
          eventUrl[0] = language;
        }

        this.router.navigateByUrl('/' + eventUrl.join('/'), { replaceUrl: true });
      });
  }
}
