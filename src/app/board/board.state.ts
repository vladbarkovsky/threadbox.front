import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardDto } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class BoardState {
  private board$ = new BehaviorSubject<BoardDto | undefined>(undefined);

  getBoard() {
    return this.board$;
  }

  setBoard(boardDto: BoardDto) {
    this.board$.next(boardDto);
  }
}
