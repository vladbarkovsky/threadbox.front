import { Injectable } from '@angular/core';
import { BoardsClient } from 'api-client';
import { BoardState } from './board.state';
import { first } from 'rxjs/operators';
import { ToastService } from 'src/app/common/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class BoardFacade {
  constructor(private boardsClient: BoardsClient, private boardState: BoardState, private toastService: ToastService) {}

  getBoard(boardId: string) {
    this.boardsClient
      .getBoard(boardId)
      .pipe(first())
      .subscribe({
        next: boardDto => this.boardState.setBoard(boardDto),
        error: () => this.toastService.showErrorToast('Unable to get board data'),
      });
  }
}
