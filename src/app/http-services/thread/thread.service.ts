import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import {
	ThreadClient,
	type DeleteThreadCommand,
	type FileResponse,
	type PaginatedResultOfThreadDto,
	type ThreadDto,
} from '../../../../api-client';
import { convertToNSwagClientFileParameter } from '../../common/nswag-operations';
import type { CreateThreadCommand } from './create-thread-command';
import type { GetThreadListQuery } from './get-thread-list-query';

@Injectable({ providedIn: 'root' })
export class ThreadService {
	private readonly threadClient: ThreadClient = inject(ThreadClient);

	getList(query: GetThreadListQuery): Observable<PaginatedResultOfThreadDto> {
		return this.threadClient.getList(query.boardId, query.searchText, query.pageIndex, query.pageSize);
	}

	get(id: string): Observable<ThreadDto> {
		return this.threadClient.get(id);
	}

	create(command: CreateThreadCommand): Observable<ThreadDto> {
		return this.threadClient.create(
			command.boardId,
			command.title,
			command.text,
			command.tripcodeString,
			command.images?.map(convertToNSwagClientFileParameter)
		);
	}

	delete(command: DeleteThreadCommand): Observable<void> {
		return this.threadClient.delete(command);
	}

	getImagesZip(threadId: string): Observable<FileResponse> {
		return this.threadClient.getImagesZip(threadId);
	}
}
