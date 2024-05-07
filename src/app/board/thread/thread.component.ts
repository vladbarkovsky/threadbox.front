import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ThreadState } from './thread.state';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FilesClient, PostDto, PostsClient, ThreadDto } from '../../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, first, switchMap } from 'rxjs';
import { downloadFile } from '../../common/file-operations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePostModalComponent } from '../create-post/create-post-modal.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PostsPermissions, ThreadsPermissions } from '../../../../api-permissions';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
  standalone: true,
  imports: [LazyLoadImageModule, AsyncPipe, NgClass, DatePipe, NgxPermissionsModule, TranslocoDirective],
  providers: [ThreadState],
})
export class ThreadComponent implements OnInit {
  private readonly postsClient = inject(PostsClient);
  private readonly threadState = inject(ThreadState);
  private readonly destroyRef = inject(DestroyRef);
  private readonly filesClient = inject(FilesClient);
  private readonly ngbModal = inject(NgbModal);

  threadPermissions = ThreadsPermissions;
  postPermissions = PostsPermissions;

  @Input() thread!: ThreadDto;
  @Output() readonly deleteThread = new EventEmitter<void>();
  posts$: Observable<PostDto[]> = this.threadState.getPosts();
  allPostsLoaded = false;

  ngOnInit(): void {
    this.allPostsLoaded = !this.thread.hasMorePosts;
    this.threadState.setPosts(this.thread.posts!);
  }

  emitDeleteThreadEvent(): void {
    this.deleteThread.emit();
  }

  togglePosts(): void {
    if (!this.allPostsLoaded) {
      this.postsClient
        .getPosts(this.thread.id, true)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: posts => {
            this.threadState.setPosts(posts);
            this.allPostsLoaded = true;
          },
          error: error => console.log(error),
        });
    } else {
      this.threadState.hidePosts();
      this.allPostsLoaded = false;
    }
  }

  openCreatePostModal(): void {
    const ngbModalRef = this.ngbModal.open(CreatePostModalComponent, { backdrop: 'static', centered: true, size: 'xl' });
    ngbModalRef.componentInstance.threadId = this.thread.id;

    ngbModalRef.closed
      .pipe(
        first(),
        switchMap(() => this.postsClient.getPosts(this.thread.id, this.allPostsLoaded)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: posts => this.threadState.setPosts(posts),
        error: error => console.log(error),
      });
  }

  downloadThreadImages(): void {
    if (this.thread.threadImages?.length === 1) {
      this.downloadImage(this.thread.threadImages[0].fileInfoId);
    } else {
      this.filesClient
        .getThreadImagesZip(this.thread.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: fileResponse => downloadFile(fileResponse.data, fileResponse.fileName!),
          error: error => console.log(error),
        });
    }
  }

  downloadPostImages(post: PostDto): void {
    if (post.postImages?.length === 1) {
      this.downloadImage(post.postImages[0].fileInfoId);
    } else {
      this.filesClient
        .getPostImagesZip(post.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: fileResponse => downloadFile(fileResponse.data, fileResponse.fileName!),
          error: error => console.log(error),
        });
    }
  }

  private downloadImage(fileInfoId: string): void {
    this.filesClient
      .getFile(fileInfoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fileResponse => downloadFile(fileResponse.data, fileResponse.fileName!),
        error: error => console.log(error),
      });
  }
}
