import type { OnInit } from '@angular/core';
import { Component, DestroyRef, inject } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import type { BoardDto, FileResponse, ThreadDto } from '../../../api-client';
import { BoardsClient, ThreadsClient } from '../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTrackingDirective } from '../common/scroll-tracking.directive';
import { ThreadsListState } from './threads-list.state';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule } from '@angular/forms';
import { CreateThreadComponent } from './create-thread/create-thread.component';
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
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly threadsListState = inject(ThreadsListState);
	private readonly boardsClient = inject(BoardsClient);
	private readonly threadsClient = inject(ThreadsClient);
	private readonly destroyRef = inject(DestroyRef);
	private readonly ngbModal = inject(NgbModal);

	readonly translationKey = TranslationKey;

	get threads(): ThreadDto[] {
		return this.threadsListState.threads;
	}

	board: BoardDto | undefined;

	// TODO: Create URL query parameter 'search', investigate safe URL features in Angular.
	searchText: string = '';

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(
				switchMap((params: Params): Observable<BoardDto> => this.boardsClient.getBoard(params['boardId'] as string)),
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
		const querySearchText = this.threadsListState.query.searchText;
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

	deleteThread(threadId: string): void {
		const ngbModalRef = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', centered: true });
		const component: ConfirmationModalComponent = ngbModalRef.componentInstance as ConfirmationModalComponent;
		component.text = TranslationKey.Board_DeleteThread;

		ngbModalRef.closed
			.pipe(
				first(),
				switchMap((): Observable<FileResponse> => this.threadsClient.deleteThread(threadId)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (): void => {
					this.threadsListState.removeThread(threadId);
				},
				error: (error): void => {
					console.log(error);
				},
			});
	}

	private getThreads(): void {
		this.threadsClient
			.getThreads(this.threadsListState.query)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (result): void => {
					this.threadsListState.addThreads(result);
					this.threadsListState.query.pageIndex += 1;
				},
				error: (error): void => {
					console.log(error);
				},
			});
	}
}
