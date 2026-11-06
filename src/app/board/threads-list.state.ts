import { Injectable } from '@angular/core';
import type { PaginatedResultOfThreadDto, ThreadDto } from '../../../api-client';
import { GetThreadListQuery } from '../../../api-client';

@Injectable()
export class ThreadsListState {
	get threads(): ThreadDto[] {
		return this._threads;
	}

	private _threads: ThreadDto[] = [];

	query: GetThreadListQuery;
	result: PaginatedResultOfThreadDto | undefined;

	constructor() {
		this.query = new GetThreadListQuery({
			pageIndex: 0,
			pageSize: 4,
			boardId: '',
			searchText: '',
		});
	}

	addThreads(result: PaginatedResultOfThreadDto): void {
		this.result = result;
		const pageItems: ThreadDto[] = result.pageItems ?? [];
		this._threads = this._threads.concat(pageItems);
	}

	removeThread(threadId: string): void {
		this._threads = this._threads.filter((thread: ThreadDto): boolean => thread.id !== threadId);
	}

	reset(): void {
		this._threads = [];
		this.query.pageIndex = 0;
	}
}
