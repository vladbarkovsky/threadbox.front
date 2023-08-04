import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({ template: '' })
export abstract class MemoryLeaksProtectedComponent implements OnDestroy {
  // Taken from https://stackoverflow.com/a/42490431

  // The ReplaySubject will help to keep the component in an destroyed state even if you try
  // to use any of the observable after ngOnDestroy() has already been called. Any late
  // subscriptions will instantly trigger the replayed value from the ReplaySubject and complete.
  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
