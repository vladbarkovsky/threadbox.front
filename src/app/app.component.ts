import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageFacade } from './common/local-storage-facade';
import { APP_ROUTES } from './app.routes';

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
    const language = LocalStorageFacade.language;

    if (language) {
      this.translocoService.setActiveLang(language);
    }

    this.processLanguageSegment();
  }

  private processLanguageSegment(): void {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationStart),
        map(x => x as NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const url = event.url.split('/').filter(x => x);
        const firstSegment = url[0];

        console.log(this.translocoService.getActiveLang());
        if (firstSegment === this.translocoService.getActiveLang()) {
          return;
        }

        if (this.translocoService.isLang(firstSegment)) {
          this.translocoService.setActiveLang(firstSegment);
          LocalStorageFacade.language = firstSegment;
          return;
        }

        // If we don't know such language code, we check if first segment matches
        // with one of registered routes.

        const routingPaths = APP_ROUTES.find(x => x.path === ':language')!
          .children!.filter(x => x.path && x.path !== '**')!
          .map(x => x.path!);

        const language = LocalStorageFacade.language ?? this.translocoService.getDefaultLang();

        // If we found matching route, we add language code before it.
        if (routingPaths.includes(firstSegment)) {
          url.unshift(language);
        }
        // Else we replace first segment with language code.
        else {
          url[0] = language;
        }

        this.router.navigateByUrl(url.join('/'), { replaceUrl: true });
      });
  }
}
