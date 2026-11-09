import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import {
	BoardClient,
	type BoardDto,
	type CreateBoardCommand,
	type DeleteBoardCommand,
	type SectionBoardDto,
	type UpdateBoardCommand,
} from '../../../../api-client';

@Injectable({ providedIn: 'root' })
export class BoardService {
	private readonly boardClient: BoardClient = inject(BoardClient);

	getList(): Observable<SectionBoardDto[]> {
		return this.boardClient.getList();
	}

	get(id: string): Observable<BoardDto> {
		return this.boardClient.get(id);
	}

	create(command: CreateBoardCommand): Observable<BoardDto> {
		return this.boardClient.create(command);
	}

	update(command: UpdateBoardCommand): Observable<BoardDto> {
		return this.boardClient.update(command);
	}

	delete(command: DeleteBoardCommand): Observable<void> {
		return this.boardClient.delete(command);
	}
}
