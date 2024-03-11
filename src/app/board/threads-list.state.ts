import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetThreadsQuery, PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';

@Injectable()
export class ThreadsListState {
  query: GetThreadsQuery | undefined;
  result: PaginatedResultOfThreadDto | undefined;

  private readonly threads$ = new BehaviorSubject<ThreadDto[]>([]);

  getThreads(): Observable<ThreadDto[]> {
    return this.threads$.asObservable();
  }

  addThreads(result: PaginatedResultOfThreadDto) {
    this.result = result;
    this.threads$.next(this.threads$.value.concat(result.pageItems!));
  }

  reset() {
    this.threads$.next([]);
  }
}
