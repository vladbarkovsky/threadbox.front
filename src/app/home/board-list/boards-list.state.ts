import { Injectable } from '@angular/core';
import { BoardListDto } from 'api-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardsListState {
  private boards$ = new BehaviorSubject<BoardListDto[] | undefined>(undefined);

  getBoards() {
    return this.boards$;
  }

  setBoards(value: BoardListDto[]) {
    this.boards$.next(value);
  }
}
