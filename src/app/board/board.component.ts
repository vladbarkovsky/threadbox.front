import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardState } from './board.state';
import { switchMap } from 'rxjs/operators';
import { ThreadsListComponent } from './threads-list/threads-list.component';
import { AsyncPipe } from '@angular/common';
import { BoardsClient } from '../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [ThreadsListComponent, AsyncPipe],
  providers: [BoardState],
})
export class BoardComponent implements OnInit {
  private readonly boardState = inject(BoardState);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly boardsClient = inject(BoardsClient);
  private readonly destroyRef = inject(DestroyRef);

  board$ = this.boardState.getBoard();

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => this.boardsClient.getBoard(params['boardId'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: boardDto => this.boardState.setBoard(boardDto),
        error: () => console.log('Unable to get board data'),
      });
  }
}
