import { Component, Input, OnInit } from '@angular/core';
import { ThreadsListFacade } from './threads.list.facade';
import { GetThreadsByBoardQuery } from 'api-client';
import { ThreadsListState } from './threads-list.state';

@Component({
  selector: 'app-threads-list',
  templateUrl: './threads-list.component.html',
  styleUrls: ['./threads-list.component.scss'],
})
export class ThreadsListComponent implements OnInit {
  @Input() boardId!: string;

  paginatedThreads$ = this.threadsListState.getPaginatedThreads();

  constructor(private threadsListFacade: ThreadsListFacade, private threadsListState: ThreadsListState) {}

  ngOnInit() {
    this.threadsListFacade.getPaginatedThreads(
      new GetThreadsByBoardQuery({
        boardId: this.boardId,
        pageIndex: 0,
        pageSize: 10,
      })
    );
  }
}
