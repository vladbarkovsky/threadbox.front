import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SectionDto } from '../../../api-client';

@Injectable({ providedIn: 'root' })
export class HomePageState {
  private sections$ = new Subject<SectionDto[]>();

  getSections(): Observable<SectionDto[] | undefined> {
    return this.sections$.asObservable();
  }

  setSections(value: SectionDto[]): void {
    this.sections$.next(value);
  }
}
