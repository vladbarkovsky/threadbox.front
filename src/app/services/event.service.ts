import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileParameter } from 'api-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly addBoard$ = new Subject<FormGroup>();
  readonly editBoard$ = new Subject<FormGroup>();
  readonly deleteBoard$ = new Subject<string>();

  readonly addThread$ = new Subject<{ threadForm: FormGroup; imageFileParameters: FileParameter[] }>();

  readonly downloadPostImages$ = new Subject<string>();
}
