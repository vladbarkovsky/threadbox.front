import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetThreadsByBoardQuery, PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';

@Injectable()
export class ThreadsListState {
  query: GetThreadsByBoardQuery | undefined;
  result: PaginatedResultOfThreadDto | undefined;

  private readonly threads$ = new BehaviorSubject<ThreadDto[]>([]);

  getThreads(): Observable<ThreadDto[]> {
    return this.threads$.asObservable();
  }

  addThreads(result: PaginatedResultOfThreadDto) {
    this.result = result;
    this.threads$.next(this.threads$.value.concat(result.pageItems!));
    this.query!.pageIndex += 1;
  }
}
