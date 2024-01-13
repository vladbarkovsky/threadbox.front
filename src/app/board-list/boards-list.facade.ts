import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { BoardsClient, BoardDto, CreateBoardCommand, UpdateBoardCommand, BoardListDto } from '../../../api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardsListFacade {
  private readonly boardsClient = inject(BoardsClient);

  getBoard(boardId: string): Observable<BoardDto> {
    return this.boardsClient.getBoard(boardId);
  }

  getBoards(): Observable<BoardListDto[]> {
    return this.boardsClient.getBoardsList();
  }

  createBoard(createBoardCommand: CreateBoardCommand): Observable<void> {
    return this.boardsClient.createBoard(createBoardCommand).pipe(map(() => {}));
  }

  updateBoard(updateBoardCommand: UpdateBoardCommand): Observable<void> {
    return this.boardsClient.updateBoard(updateBoardCommand).pipe(map(() => {}));
  }

  deleteBoard(boardId: string): Observable<void> {
    return this.boardsClient.deleteBoard(boardId).pipe(map(() => {}));
  }
}
