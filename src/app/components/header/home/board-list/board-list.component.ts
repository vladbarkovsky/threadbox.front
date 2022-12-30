import { Component, OnInit } from '@angular/core';
import { BoardsClient, ListBoardDto } from 'api-client';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  boards: ListBoardDto[] = [];

  constructor(private boardsClient: BoardsClient, private toastService: ToastService) {}

  ngOnInit(): void {
    this.boardsClient.getBoardsList().subscribe({
      next: x => (this.boards = x),
      error: () => this.toastService.show({ text: 'Unable to load boards for vertical side menu.', type: 'danger' }),
    });
  }
}
