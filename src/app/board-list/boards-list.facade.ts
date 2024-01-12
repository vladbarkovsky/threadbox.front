import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { BoardsListState } from './boards-list.state';
import { BoardsClient, BoardDto, CreateBoardCommand, UpdateBoardCommand } from '../../../api-client';
import { ToastService } from '../common/toast/toast.service';

@Injectable()
export class BoardsListFacade {
  constructor(
    private boardsClient: BoardsClient,
    private boardsListState: BoardsListState,
    private toastService: ToastService
  ) {}

  getBoard(boardId: string, callback: (boardDto: BoardDto) => void) {
    return this.boardsClient
      .getBoard(boardId)
      .pipe(first())
      .subscribe({
        next: boardDto => callback(boardDto),
        error: () => this.toastService.showErrorToast('Unable to get board data'),
      });
  }

  getBoards() {
    this.boardsClient
      .getBoardsList()
      .pipe(first())
      .subscribe({
        next: boards => this.boardsListState.setBoards(boards),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  createBoard(createBoardCommand: CreateBoardCommand, callback: () => void) {
    this.boardsClient
      .createBoard(createBoardCommand)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showSuccessToast('Board created');
          callback();
        },

        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  updateBoard(updateBoardCommand: UpdateBoardCommand, callback: () => void) {
    this.boardsClient
      .updateBoard(updateBoardCommand)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showSuccessToast('Board updated');
          callback();
        },

        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  deleteBoard(boardId: string) {
    this.boardsClient
      .deleteBoard(boardId)
      .pipe(first())
      .subscribe({
        next: () => this.toastService.showSuccessToast('Board deleted'),
        error: () => this.toastService.showErrorToast('Unable to delete board'),
      });
  }
}
