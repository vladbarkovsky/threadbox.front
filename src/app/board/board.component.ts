import type { OnInit } from '@angular/core';
import { Component, DestroyRef, inject } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import type { BoardDto, FileResponse, PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';
import { BoardClient, ThreadClient } from '../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTrackingDirective } from '../common/scroll-tracking.directive';
import { ThreadsListState } from './threads-list.state';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule } from '@angular/forms';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import type { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { TranslatePipe } from '../common/localization/translate.pipe';
import { TranslationKey } from '../common/localization/translation-key.enum';
import type { Observable } from 'rxjs';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	standalone: true,
	imports: [ScrollTrackingDirective, ThreadComponent, FormsModule, CreateThreadComponent, TranslatePipe],
	providers: [ThreadsListState],
})
export class BoardComponent implements OnInit {
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	private readonly threadsListState: ThreadsListState = inject(ThreadsListState);
	private readonly boardClient: BoardClient = inject(BoardClient);
	private readonly threadClient: ThreadClient = inject(ThreadClient);
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly ngbModal: NgbModal = inject(NgbModal);

	readonly translationKey: typeof TranslationKey = TranslationKey;

	get threads(): ThreadDto[] {
		return this.threadsListState.threads;
	}

	board: BoardDto | undefined;

	// TODO: Create URL query parameter 'search', investigate safe URL features in Angular.
	searchText: string = '';

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(
				switchMap((params: Params): Observable<BoardDto> => this.boardClient.get(params['boardId'] as string)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (board: BoardDto): void => {
					this.board = board;
					this.threadsListState.query.boardId = board.id;
					this.getThreads();
				},
				// TODO: Show error.
				error: (): void => {
					// eslint-disable-next-line no-console
					console.log('Unable to get board data');
				},
			});
	}

	/**
	 * Handles element scrolling threshold passing.
	 *
	 * @memberof BoardComponent
	 */
	onThresholdPassed(): void {
		if (this.threadsListState.result?.hasNextPage === true) {
			this.getThreads();
		}
	}

	onSearchInputBlur(): void {
		const querySearchText: string | null | undefined = this.threadsListState.query.searchText;

		if (this.searchText === '' && querySearchText !== undefined && querySearchText !== '') {
			this.threadsListState.query.searchText = '';
			this.threadsListState.reset();
			this.getThreads();
		}
	}

	searchThreads(): void {
		this.threadsListState.query.searchText = this.searchText;
		this.threadsListState.reset();
		this.getThreads();
	}

	onThreadCreated(): void {
		this.threadsListState.query.searchText = '';
		this.threadsListState.reset();
		this.getThreads();
	}

	deleteThread(thread: ThreadDto): void {
		const ngbModalRef: NgbModalRef = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', centered: true });
		const component: ConfirmationModalComponent = ngbModalRef.componentInstance as ConfirmationModalComponent;
		component.text = TranslationKey.BoardDeleteThread;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<FileResponse> => this.threadClient.delete(thread.id, thread.rowVersion)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (): void => {
					this.threadsListState.removeThread(thread.id);
				},
				error: (error: unknown): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}

	private getThreads(): void {
		this.boardClient
			.getThreadList(this.threadsListState.query.boardId, this.threadsListState.query)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (result: PaginatedResultOfThreadDto): void => {
					this.threadsListState.addThreads(result);
					this.threadsListState.query.pageIndex += 1;
				},
				error: (error: unknown): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}
}
