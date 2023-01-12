import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly downloadPostImages$ = new ReplaySubject<string>();
  readonly addBoard$ = new ReplaySubject<FormGroup>();
  readonly editBoard$ = new ReplaySubject<FormGroup>();
}
