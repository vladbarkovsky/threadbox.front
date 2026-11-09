import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import {
	SectionClient,
	type CreateSectionCommand,
	type SectionDto,
	type SectionListDto,
	type UpdateSectionCommand,
} from '../../../../api-client';

@Injectable({ providedIn: 'root' })
export class SectionService {
	private readonly sectionClient: SectionClient = inject(SectionClient);

	getList(): Observable<SectionListDto[]> {
		return this.sectionClient.getList();
	}

	get(id: string): Observable<SectionDto> {
		return this.sectionClient.get(id);
	}

	create(command: CreateSectionCommand): Observable<SectionDto> {
		return this.sectionClient.create(command);
	}

	update(command: UpdateSectionCommand): Observable<SectionDto> {
		return this.sectionClient.update(command);
	}
}
