import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileParameter } from 'api-client';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly addBoard$ = new ReplaySubject<FormGroup>();
  readonly editBoard$ = new ReplaySubject<FormGroup>();
  readonly deleteBoard$ = new ReplaySubject<string>();

  readonly addThread$ = new ReplaySubject<{ threadForm: FormGroup; imageFileParameters: FileParameter[] }>();

  readonly downloadPostImages$ = new ReplaySubject<string>();
}
