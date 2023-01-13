import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly addBoard$ = new ReplaySubject<FormGroup>();
  readonly editBoard$ = new ReplaySubject<FormGroup>();
  readonly deleteBoard$ = new ReplaySubject<string>();

  readonly addThread$ = new ReplaySubject<FormGroup>();

  readonly downloadPostImages$ = new ReplaySubject<string>();
}
