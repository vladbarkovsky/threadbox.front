import { Component, Input, OnInit } from '@angular/core';
import { ThreadsListFacade } from './threads.list.facade';
import { ThreadsListState } from './threads-list.state';
import { GetThreadsByBoardQuery } from '../../../../api-client';
import { HttpSourceDirective } from '../../common/directives/http-source/http-source.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-threads-list',
  templateUrl: './threads-list.component.html',
  styleUrls: ['./threads-list.component.scss'],
  standalone: true,
  imports: [HttpSourceDirective, AsyncPipe],
})
export class ThreadsListComponent implements OnInit {
  @Input() boardId!: string;

  paginatedThreads$ = this.threadsListState.getPaginatedThreads();

  constructor(
    private threadsListFacade: ThreadsListFacade,
    private threadsListState: ThreadsListState
  ) {}

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
