import { Injectable } from '@angular/core';
import { GetThreadsQuery, PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';

@Injectable()
export class ThreadsListState {
  get threads(): ThreadDto[] {
    return this._threads;
  }

  private _threads: ThreadDto[] = [];

  query: GetThreadsQuery;
  result: PaginatedResultOfThreadDto | undefined;

  constructor() {
    this.query = new GetThreadsQuery({
      pageIndex: 0,
      pageSize: 4,
      boardId: '',
      searchText: '',
    });
  }

  addThreads(result: PaginatedResultOfThreadDto) {
    this.result = result;
    this._threads = this._threads.concat(result.pageItems!);
  }

  removeThread(threadId: string) {
    this._threads = this._threads.filter(x => x.id !== threadId);
  }

  reset() {
    this._threads = [];
    this.query.pageIndex = 0;
  }
}
