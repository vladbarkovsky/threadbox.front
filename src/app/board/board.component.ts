import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardFacade } from './board.facade';
import { BoardState } from './board.state';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  board$ = this.boardState.getBoard();

  constructor(private boardFacade: BoardFacade, private boardState: BoardState, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(first()).subscribe(params => this.boardFacade.getBoard(params.boardId));
  }
}
