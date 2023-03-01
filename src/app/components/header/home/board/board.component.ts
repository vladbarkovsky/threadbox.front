import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  PaginationParamsDto,
  ThreadsClient,
  ListThreadDto,
  BoardsClient,
  BoardDto,
  FileParameter,
  PostImagesClient,
  ThreadImagesClient,
} from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddThreadModalComponent } from './add-thread-modal/add-thread-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends BaseComponent implements OnInit {
  boardId: string = this.activatedRoute.snapshot.params.boardId;
  board?: BoardDto;
  currentPageThreads: ListThreadDto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private threadsClient: ThreadsClient,
    private toastService: ToastService,
    private threadImagesClient: ThreadImagesClient,
    private postImagesClient: PostImagesClient,
    private fileService: FileService,
    private boardsClient: BoardsClient,
    private eventService: EventService,
    private modal: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.boardsClient
      .getBoard(this.boardId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => (this.board = x),
        error: () => this.toastService.show({ text: 'Unable to load board data.', type: 'danger' }),
      });

    this.threadsClient
      .getThreadsByBoard(this.boardId, new PaginationParamsDto({ pageIndex: 0, pageSize: 10 }))
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => (this.currentPageThreads = x.pageItems),
        error: () => this.toastService.show({ text: 'Unable to load threads for current page.', type: 'danger' }),
      });

    this.eventService.addThread$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => this.addThread(x.threadForm, x.imageFileParameters));
    this.eventService.downloadPostImages$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.downloadPostImages(x));
  }

  openAddThreadModal(): void {
    this.modal.open(AddThreadModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'xl' });
  }

  private addThread(threadForm: FormGroup, imageFileParameters: FileParameter[]): void {
    this.threadsClient
      .createThread(this.boardId, threadForm.controls['title'].value, threadForm.controls['text'].value, imageFileParameters)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
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
    this.threadImagesClient
      .getThreadImages(threadId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => this.fileService.downloadFile(x?.data!, `Thread_${threadId}_images`),
        error: () => this.toastService.show({ text: 'Unable to load thread images.', type: 'danger' }),
      });
  }

  downloadPostImages(postId: string): void {
    this.postImagesClient
      .getPostImages(postId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => this.fileService.downloadFile(x?.data!, `Post_${postId}_images`),
        error: () => this.toastService.show({ text: 'Unable to download post images.', type: 'danger' }),
      });
  }
}
