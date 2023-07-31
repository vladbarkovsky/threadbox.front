import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly deleteBoard$ = new Subject<{ boardId: string }>();
  readonly downloadPostImages$ = new Subject<{ postId: string }>();
}
