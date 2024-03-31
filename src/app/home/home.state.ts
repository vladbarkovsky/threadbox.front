import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SectionListDto } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class HomeState {
  private sections$ = new Subject<SectionListDto[]>();

  getSections(): Observable<SectionListDto[] | undefined> {
    return this.sections$.asObservable();
  }

  setSections(value: SectionListDto[]): void {
    this.sections$.next(value);
  }
}
