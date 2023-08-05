import { Injectable } from '@angular/core';
import { PaginatedResultOfThreadDto } from 'api-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThreadsListState {
  private paginatedThreads$ = new BehaviorSubject<PaginatedResultOfThreadDto | undefined>(undefined);

  getPaginatedThreads() {
    return this.paginatedThreads$;
  }

  setPaginatedThreads(paginatedThreads: PaginatedResultOfThreadDto) {
    return this.paginatedThreads$.next(paginatedThreads);
  }
}
