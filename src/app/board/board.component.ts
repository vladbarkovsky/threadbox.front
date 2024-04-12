import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BoardDto, BoardsClient, ThreadDto, ThreadsClient } from '../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTrackingDirective } from '../common/scroll-tracking.directive';
import { ThreadsListState } from './threads-list.state';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule } from '@angular/forms';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [AsyncPipe, ScrollTrackingDirective, ThreadComponent, FormsModule, CreateThreadComponent, JsonPipe],
  providers: [ThreadsListState],
})
export class BoardComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly threadsListState = inject(ThreadsListState);
  private readonly boardsClient = inject(BoardsClient);
  private readonly threadsClient = inject(ThreadsClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngbModal = inject(NgbModal);

  get threads(): ThreadDto[] {
    return this.threadsListState.threads;
  }

  board: BoardDto | undefined;

  // TODO: Create URL query parameter 'search', investigate safe URL features in Angular.
  searchText: string = '';

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => this.boardsClient.getBoard(params['boardId'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: board => {
          this.board = board;
          this.threadsListState.query.boardId = board.id;
          this.getThreads();
        },
        // TODO: Show error.
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
    if (!this.searchText && this.threadsListState.query.searchText) {
      this.threadsListState.query.searchText = '';
      this.threadsListState.reset();
      this.getThreads();
    }
  }

  searchThreads() {
    this.threadsListState.query.searchText = this.searchText;
    this.threadsListState.reset();
    this.getThreads();
  }

  onThreadCreated(): void {
    this.threadsListState.query.searchText = '';
    this.threadsListState.reset();
    this.getThreads();
  }

  deleteThread(threadId: string): void {
    const ngbModalRef = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', centered: true });
    ngbModalRef.componentInstance.text = 'Delete thread.';

    ngbModalRef.closed
      .pipe(
        first(),
        switchMap(() => this.threadsClient.deleteThread(threadId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.threadsListState.removeThread(threadId),
        error: error => console.log(error),
      });
  }

  private getThreads(): void {
    this.threadsClient
      .getThreads(this.threadsListState.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.threadsListState.addThreads(result);
          this.threadsListState.query.pageIndex += 1;
        },
        error: error => console.log(error),
      });
  }
}
