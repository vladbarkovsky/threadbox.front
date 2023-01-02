import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  downloadPostImages$ = new ReplaySubject<string>();
  addBoard$ = new ReplaySubject<FormGroup>();
}
