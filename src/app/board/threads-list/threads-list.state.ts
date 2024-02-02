import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetThreadsByBoardQuery, PaginatedResultOfThreadDto, ThreadDto } from '../../../../api-client';

@Injectable()
export class ThreadsListState {
  query: GetThreadsByBoardQuery;
  result: PaginatedResultOfThreadDto | undefined;

  private readonly threads$ = new BehaviorSubject<ThreadDto[]>([]);

  constructor() {
    this.query = new GetThreadsByBoardQuery({
      boardId: '',
      pageIndex: 0,
      pageSize: 10,
    });
  }

  getThreads(): Observable<ThreadDto[]> {
    return this.threads$.asObservable();
  }

  addThreads(result: PaginatedResultOfThreadDto) {
    this.result = result;
    this.threads$.next(this.threads$.value.concat(result.pageItems!));
  }
}
