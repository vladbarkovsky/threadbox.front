import { Injectable } from '@angular/core';
import { GetThreadsQuery, PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ThreadsListState {
  query: GetThreadsQuery;
  result: PaginatedResultOfThreadDto | undefined;
  private readonly threads$ = new BehaviorSubject<ThreadDto[]>([]);

  constructor() {
    this.query = new GetThreadsQuery({
      pageIndex: 0,
      pageSize: 4,
      boardId: '',
      searchText: '',
    });
  }

  getThreads(): Observable<ThreadDto[]> {
    return this.threads$.asObservable();
  }

  addThreads(result: PaginatedResultOfThreadDto) {
    this.result = result;
    this.threads$.next(this.threads$.value.concat(result.pageItems!));
  }

  removeThread(threadId: string) {
    this.threads$.next(this.threads$.value.filter(x => x.id !== threadId));
  }

  reset() {
    this.threads$.next([]);
    this.query.pageIndex = 0;
  }
}
