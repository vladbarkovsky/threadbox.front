import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaginatedResultOfThreadDto } from '../../../../api-client';

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
