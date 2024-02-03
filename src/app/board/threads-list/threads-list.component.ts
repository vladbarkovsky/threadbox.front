import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { ThreadsListState } from './threads-list.state';
import { ThreadsClient } from '../../../../api-client';
import { AsyncPipe } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTrackingDirective } from '../../common/scroll-tracking.directive';

@Component({
  selector: 'app-threads-list',
  templateUrl: './threads-list.component.html',
  styleUrls: ['./threads-list.component.scss'],
  standalone: true,
  imports: [LazyLoadImageModule, AsyncPipe, ScrollTrackingDirective],
  providers: [ThreadsListState],
})
export class ThreadsListComponent implements OnInit {
  private readonly threadsListState = inject(ThreadsListState);
  private readonly threadsClient = inject(ThreadsClient);
  private readonly destroyRef = inject(DestroyRef);

  @Input() boardId!: string;

  threads$ = this.threadsListState.getThreads();

  ngOnInit(): void {
    this.threadsListState.query.boardId = this.boardId;

    this.threadsClient
      .getThreadsByBoard(this.threadsListState.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => this.threadsListState.addThreads(result),
        error: error => console.log(error),
      });
  }

  /**
   * Handles element scrolling threshold passing.
   *
   * @memberof ThreadsListComponent
   */
  onThresholdPassed(): void {
    console.log('Scrolling threshold passed!');
  }
}
