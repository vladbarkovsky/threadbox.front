import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoardListDto } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class BoardsListState {
  private boards$ = new Subject<BoardListDto[]>();

  getBoards(): Observable<BoardListDto[] | undefined> {
    return this.boards$.asObservable();
  }

  setBoards(value: BoardListDto[]): void {
    this.boards$.next(value);
  }
}
