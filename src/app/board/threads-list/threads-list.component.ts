import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { ThreadsListState } from './threads-list.state';
import { ThreadsClient } from '../../../../api-client';
import { AsyncPipe } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-threads-list',
  templateUrl: './threads-list.component.html',
  styleUrls: ['./threads-list.component.scss'],
  standalone: true,
  imports: [LazyLoadImageModule, AsyncPipe],
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
}
