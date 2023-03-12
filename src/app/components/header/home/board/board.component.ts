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
import { MemoryLeaksProtectedComponent } from 'src/app/components/memory-leaks-protected.component';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddThreadModalComponent } from './add-thread-modal/add-thread-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends MemoryLeaksProtectedComponent implements OnInit {
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
        error: () => this.toastService.error('Unable to load board data.'),
      });

    this.threadsClient
      .getThreadsByBoard(this.boardId, new PaginationParamsDto({ pageIndex: 0, pageSize: 10 }))
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => (this.currentPageThreads = x.pageItems),
        error: () => this.toastService.error('Unable to load threads for current page.'),
      });

    this.eventService.addThread$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => this.addThread(x.threadForm, x.imageFileParameters));
    this.eventService.downloadPostImages$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.downloadPostImages(x.postId));
  }

  openAddThreadModal(): void {
    this.modal.open(AddThreadModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'xl' });
  }

  private addThread(threadForm: FormGroup, imageFileParameters: FileParameter[]): void {
    this.threadsClient
      .createThread(this.boardId, threadForm.controls['title'].value, threadForm.controls['text'].value, imageFileParameters)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: listThreadDto => {
          this.currentPageThreads.push(listThreadDto);
          this.toastService.success('Thread successfully added.');
          this.modal.dismissAll();
        },
        error: () => this.toastService.error('Unable to add thread.'),
      });
  }

  downloadThreadImages(threadId: string): void {
    this.threadImagesClient
      .getThreadImages(threadId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => this.fileService.downloadFile(x?.data!, `Thread_${threadId}_images`),
        error: () => this.toastService.error('Unable to load thread images.'),
      });
  }

  downloadPostImages(postId: string): void {
    this.postImagesClient
      .getPostImages(postId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => this.fileService.downloadFile(x?.data!, `Post_${postId}_images`),
        error: () => this.toastService.error('Unable to download post images.'),
      });
  }
}
