import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { SectionListDto } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class HomeState {
	private readonly sections$: Subject<SectionListDto[]> = new Subject<SectionListDto[]>();

	getSections(): Observable<SectionListDto[] | undefined> {
		return this.sections$.asObservable();
	}

	setSections(value: SectionListDto[]): void {
		this.sections$.next(value);
	}
}
