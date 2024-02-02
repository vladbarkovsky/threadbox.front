import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BoardDto } from '../../../api-client';

@Injectable()
export class BoardState {
  private board$ = new Subject<BoardDto>();

  getBoard() {
    return this.board$.asObservable();
  }

  setBoard(boardDto: BoardDto) {
    this.board$.next(boardDto);
  }
}
