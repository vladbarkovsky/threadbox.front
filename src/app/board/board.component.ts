import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardState } from './board.state';
import { switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { BoardDto, BoardsClient, GetThreadsByBoardQuery, ThreadDto, ThreadsClient } from '../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTrackingDirective } from '../common/scroll-tracking.directive';
import { ThreadsListState } from './threads-list.state';
import { Observable } from 'rxjs';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule } from '@angular/forms';
import { CreateThreadComponent } from './create-thread/create-thread.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [AsyncPipe, ScrollTrackingDirective, ThreadComponent, FormsModule, CreateThreadComponent],
  providers: [BoardState, ThreadsListState],
})
export class BoardComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly boardState = inject(BoardState);
  private readonly threadsListState = inject(ThreadsListState);
  private readonly boardsClient = inject(BoardsClient);
  private readonly threadsClient = inject(ThreadsClient);
  private readonly destroyRef = inject(DestroyRef);

  board$: Observable<BoardDto> = this.boardState.getBoard();
  threads$: Observable<ThreadDto[]> = this.threadsListState.getThreads();

  // TODO: Create URL query parameter 'search', investigate safe URL features in Angular.
  searchText: string = '';

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => this.boardsClient.getBoard(params['boardId'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: boardDto => {
          this.boardState.setBoard(boardDto);

          this.threadsListState.query = new GetThreadsByBoardQuery({
            boardId: boardDto.id,
            searchText: '',
            pageIndex: 0,
            pageSize: 4,
          });

          this.getThreads();
        },
        error: () => console.log('Unable to get board data'),
      });
  }

  /**
   * Handles element scrolling threshold passing.
   *
   * @memberof BoardComponent
   */
  onThresholdPassed(): void {
    if (this.threadsListState.result?.hasNextPage) {
      this.getThreads();
    }
  }

  onSearchInputBlur() {
    if (!this.searchText && this.threadsListState.query?.searchText) {
      this.threadsListState.query!.searchText = '';
      this.threadsListState.query!.pageIndex = 0;
      this.threadsListState.clearThreads();
      this.getThreads();
    }
  }

  searchThreads() {
    this.threadsListState.query!.searchText = this.searchText;
    this.threadsListState.query!.pageIndex = 0;
    this.threadsListState.clearThreads();
    this.getThreads();
  }

  private getThreads(): void {
    this.threadsClient
      .getThreadsByBoard(this.threadsListState.query!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.threadsListState.addThreads(result);
          this.threadsListState.query!.pageIndex += 1;
        },
        error: error => console.log(error),
      });
  }
}
