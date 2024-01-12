import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { ThreadsListState } from './threads-list.state';
import { GetThreadsByBoardQuery, ThreadsClient } from '../../../../api-client';

@Injectable({ providedIn: 'root' })
export class ThreadsListFacade {
  constructor(
    private threadsClient: ThreadsClient,
    private threadsListState: ThreadsListState
  ) {}

  getPaginatedThreads(query: GetThreadsByBoardQuery) {
    this.threadsClient
      .getThreadsByBoard(query)
      .pipe(first())
      .subscribe({
        next: paginatedThreads => this.threadsListState.setPaginatedThreads(paginatedThreads),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }
}
