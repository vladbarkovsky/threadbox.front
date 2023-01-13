import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationParamsDto, ThreadsClient, ListThreadDto, ImagesClient, BoardsClient, BoardDto, ThreadDto } from 'api-client';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string = this.activatedRoute.snapshot.params.boardId;
  board?: BoardDto;
  currentPageThreads: ListThreadDto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private threadsClient: ThreadsClient,
    private toastService: ToastService,
    private imagesClient: ImagesClient,
    private fileService: FileService,
    private boardsClient: BoardsClient,
    private eventService: EventService,
    private modal: NgbModal
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

    this.eventService.addThread$.subscribe(x => this.addThread(x));
    this.eventService.downloadPostImages$.subscribe(x => this.downloadPostImages(x));
  }

  openAddThreadModal(): void {}

  private addThread(threadForm: FormGroup): void {
    const threadDto = new ThreadDto({
      title: threadForm.controls['title'].value,
      text: threadForm.controls['text'].value,
      threadImages: threadForm.controls['images'].value,
    });

    this.threadsClient.createThread(threadDto).subscribe({
      next: x => {
        this.currentPageThreads.push(x);
        this.toastService.show({ text: 'Thread successfully added.', type: 'success' });
        this.modal.dismissAll();
      },
      error: () => {
        this.toastService.show({ text: 'Unable to add thread.', type: 'danger' });
      },
    });
  }

  downloadThreadImages(threadId: string): void {
    this.imagesClient.getThreadImages(threadId).subscribe({
      next: x => this.fileService.downloadFile(x?.data!, `Thread_${threadId}_images`),
      error: () => this.toastService.show({ text: 'Unable to load thread images.', type: 'danger' }),
    });
  }

  downloadPostImages(postId: string): void {
    this.imagesClient.getPostImages(postId).subscribe({
      next: x => this.fileService.downloadFile(x?.data!, `Post_${postId}_images`),
      error: () => this.toastService.show({ text: 'Unable to download post images.', type: 'danger' }),
    });
  }
}
