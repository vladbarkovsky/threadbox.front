import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  readonly apiBaseUrl = environment.apiBaseUrl;
  readonly destruction$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.destruction$.next();
    this.destruction$.complete();
  }
}
