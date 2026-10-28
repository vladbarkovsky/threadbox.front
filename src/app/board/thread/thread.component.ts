import type { OnInit } from '@angular/core';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import type { FileResponse, PostDto, ThreadDto } from '../../../../api-client';
import { FilesClient, PostsClient } from '../../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, switchMap, type Observable } from 'rxjs';
import { downloadFile } from '../../common/file-operations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePostModalComponent } from '../create-post/create-post-modal.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PostsPermissions, ThreadsPermissions } from '../../../../api-permissions';
import { TranslatePipe } from '../../common/localization/translate.pipe';
import { ConfirmationModalComponent } from '../../common/confirmation-modal/confirmation-modal.component';
import { TranslationKey } from '../../common/localization/translation-key.enum';
import type { HttpErrorResponse } from '@angular/common/http';
import { LocalizeDatePipe } from '../../common/localization/translate-date.pipe';

@Component({
	selector: 'app-thread',
	templateUrl: './thread.component.html',
	styleUrls: ['./thread.component.scss'],
	standalone: true,
	imports: [LazyLoadImageModule, NgClass, DatePipe, NgxPermissionsModule, TranslatePipe, LocalizeDatePipe, NgOptimizedImage],
})
export class ThreadComponent implements OnInit {
	protected readonly dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		weekday: 'long',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	};

	private readonly postsClient = inject(PostsClient);
	private readonly destroyRef = inject(DestroyRef);
	private readonly filesClient = inject(FilesClient);
	private readonly ngbModal = inject(NgbModal);

	threadPermissions = ThreadsPermissions;
	postPermissions = PostsPermissions;
	readonly translationKey = TranslationKey;

	@Input() thread!: ThreadDto;
	@Output() readonly deleteThread: EventEmitter<void> = new EventEmitter<void>();

	posts: PostDto[] = [];
	allPostsLoaded = false;

	ngOnInit(): void {
		this.posts = this.thread.posts!;
		this.allPostsLoaded = !this.thread.hasMorePosts;
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
					next: (posts: PostDto[]): void => {
						this.posts = posts;
						this.allPostsLoaded = true;
					},
					error: (error: HttpErrorResponse): void => {
						console.log(error);
					},
				});
		} else {
			this.posts = this.posts.slice(0, 3);
			this.allPostsLoaded = false;
		}
	}

	openCreatePostModal(): void {
		const ngbModalRef = this.ngbModal.open(CreatePostModalComponent, { backdrop: 'static', centered: true, size: 'xl' });
		const component: CreatePostModalComponent = ngbModalRef.componentInstance as CreatePostModalComponent;
		component.threadId = this.thread.id;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<PostDto[]> => this.postsClient.getPosts(this.thread.id, this.allPostsLoaded)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (posts: PostDto[]): void => {
					this.posts = posts;
				},
				error: (error: HttpErrorResponse): void => {
					console.log(error);
				},
			});
	}

	openDeletePostModal(postId: string): void {
		const ngbModalRef = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', centered: true });
		const component: ConfirmationModalComponent = ngbModalRef.componentInstance as ConfirmationModalComponent;
		component.text = TranslationKey.Board_DeletePost;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<FileResponse> => this.postsClient.deletePost(postId)),
				switchMap((): Observable<PostDto[]> => this.postsClient.getPosts(this.thread.id, this.allPostsLoaded)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (posts: PostDto[]): void => {
					this.posts = posts;
				},
				error: (error: HttpErrorResponse): void => {
					console.log(error);
				},
			});
	}

	downloadThreadImages(): void {
		if (this.thread.threadImages?.length === 1) {
			this.downloadImage(this.thread.threadImages[0]!.fileInfoId);
		} else {
			this.filesClient
				.getThreadImagesZip(this.thread.id)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (fileResponse: FileResponse): void => {
						downloadFile(fileResponse.data, fileResponse.fileName!);
					},
					error: (error: HttpErrorResponse): void => {
						console.log(error);
					},
				});
		}
	}

	downloadPostImages(post: PostDto): void {
		if (post.postImages?.length === 1) {
			this.downloadImage(post.postImages[0]!.fileInfoId);
		} else {
			this.filesClient
				.getPostImagesZip(post.id)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (fileResponse: FileResponse): void => {
						downloadFile(fileResponse.data, fileResponse.fileName!);
					},
					error: (error: HttpErrorResponse): void => {
						console.log(error);
					},
				});
		}
	}

	private downloadImage(fileInfoId: string): void {
		this.filesClient
			.getFile(fileInfoId)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (fileResponse: FileResponse): void => {
					downloadFile(fileResponse.data, fileResponse.fileName!);
				},
				error: (error: HttpErrorResponse): void => {
					console.log(error);
				},
			});
	}
}
