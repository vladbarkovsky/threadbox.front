import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationParamsDto, ThreadsClient, ListThreadDto, ImagesClient, BoardsClient, BoardDto } from 'api-client';
import { FileService } from 'src/app/services/file.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string = this.activatedRoute.snapshot.params.boardId;
  board?: BoardDto = undefined;
  currentPageThreads: ListThreadDto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private threadsClient: ThreadsClient,
    private toastService: ToastService,
    private imagesClient: ImagesClient,
    private fileService: FileService,
    private boardsClient: BoardsClient
  ) {}

  ngOnInit(): void {
    this.boardsClient.getBoard(this.boardId).subscribe({
      next: x => (this.board = x),
      error: () => this.toastService.show({ text: 'Unable to load board data.', type: 'danger' }),
    });

    this.threadsClient.getThreadsByBoard(this.boardId, new PaginationParamsDto({ pageIndex: 0, pageSize: 10 })).subscribe({
      next: x => (this.currentPageThreads = x.pageItems),
      error: () => this.toastService.show({ text: 'Unable to load threads for current page.', type: 'danger' }),
    });
  }

  downloadThreadImages(threadId: string) {
    this.imagesClient.getThreadImages(threadId).subscribe({
      next: x => {
        this.fileService.downloadFile(x?.data!, `Thread_${threadId}_images`);
      },
      error: () => this.toastService.show({ text: 'Unable to load thread images.', type: 'danger' }),
    });
  }
}
