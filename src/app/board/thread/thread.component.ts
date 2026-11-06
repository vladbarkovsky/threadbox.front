import type { OnInit } from '@angular/core';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import type { FileResponse, PostDto, PostImageDto, ThreadDto, ThreadImageDto } from '../../../../api-client';
import { FileClient, PostClient, ThreadClient } from '../../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, switchMap, type Observable } from 'rxjs';
import { downloadFile } from '../../common/file-operations';
import type { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
	imports: [LazyLoadImageModule, NgClass, NgxPermissionsModule, TranslatePipe, LocalizeDatePipe, NgOptimizedImage],
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

	private readonly postClient: PostClient = inject(PostClient);
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly fileClient: FileClient = inject(FileClient);
	private readonly threadClient: ThreadClient = inject(ThreadClient);
	private readonly ngbModal: NgbModal = inject(NgbModal);

	threadPermissions: typeof ThreadsPermissions = ThreadsPermissions;
	postPermissions: typeof PostsPermissions = PostsPermissions;
	readonly translationKey: typeof TranslationKey = TranslationKey;

	@Input() thread!: ThreadDto;
	@Output() readonly deleteThread: EventEmitter<void> = new EventEmitter<void>();

	posts: PostDto[] = [];
	allPostsLoaded: boolean = false;

	ngOnInit(): void {
		this.posts = this.thread.posts;
		this.allPostsLoaded = !this.thread.hasMorePosts;
	}

	emitDeleteThreadEvent(): void {
		this.deleteThread.emit();
	}

	togglePosts(): void {
		if (!this.allPostsLoaded) {
			this.postClient
				.getList(this.thread.id, true)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (posts: PostDto[]): void => {
						this.posts = posts;
						this.allPostsLoaded = true;
					},
					error: (error: HttpErrorResponse): void => {
						// eslint-disable-next-line no-console
						console.log(error);
					},
				});
		} else {
			this.posts = this.posts.slice(0, 3);
			this.allPostsLoaded = false;
		}
	}

	openCreatePostModal(): void {
		const ngbModalRef: NgbModalRef = this.ngbModal.open(CreatePostModalComponent, {
			backdrop: 'static',
			centered: true,
			size: 'xl',
		});

		const component: CreatePostModalComponent = ngbModalRef.componentInstance as CreatePostModalComponent;
		component.threadId = this.thread.id;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<PostDto[]> => this.postClient.getList(this.thread.id, this.allPostsLoaded)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (posts: PostDto[]): void => {
					this.posts = posts;
				},
				error: (error: HttpErrorResponse): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}

	openDeletePostModal(post: PostDto): void {
		const ngbModalRef: NgbModalRef = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', centered: true });
		const component: ConfirmationModalComponent = ngbModalRef.componentInstance as ConfirmationModalComponent;
		component.text = TranslationKey.BoardDeletePost;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<FileResponse> => this.postClient.delete(post.id, post.rowVersion)),
				switchMap((): Observable<PostDto[]> => this.postClient.getList(this.thread.id, this.allPostsLoaded)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (posts: PostDto[]): void => {
					this.posts = posts;
				},
				error: (error: HttpErrorResponse): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}

	downloadThreadImages(): void {
		const threadImage: ThreadImageDto | undefined = this.thread.threadImages[0];

		if (this.thread.threadImages.length === 1 && threadImage !== undefined) {
			this.downloadImage(threadImage.fileInfoId);
		} else {
			this.threadClient
				.getImagesZip(this.thread.id)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (fileResponse: FileResponse): void => {
						downloadFile(fileResponse.data, fileResponse.fileName ?? '');
					},
					error: (error: HttpErrorResponse): void => {
						// eslint-disable-next-line no-console
						console.log(error);
					},
				});
		}
	}

	downloadPostImages(post: PostDto): void {
		const postImage: PostImageDto | undefined = post.postImages[0];

		if (post.postImages.length === 1 && postImage !== undefined) {
			this.downloadImage(postImage.fileInfoId);
		} else {
			this.postClient
				.getImagesZip(post.id)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: (fileResponse: FileResponse): void => {
						downloadFile(fileResponse.data, fileResponse.fileName ?? '');
					},
					error: (error: HttpErrorResponse): void => {
						// eslint-disable-next-line no-console
						console.log(error);
					},
				});
		}
	}

	private downloadImage(fileInfoId: string): void {
		this.fileClient
			.get(fileInfoId)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (fileResponse: FileResponse): void => {
					downloadFile(fileResponse.data, fileResponse.fileName ?? '');
				},
				error: (error: HttpErrorResponse): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}
}
