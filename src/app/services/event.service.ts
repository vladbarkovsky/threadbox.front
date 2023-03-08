import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BoardDto, FileParameter } from 'api-client';
import { Subject } from 'rxjs';
import { BoardForm } from '../components/header/home/board-list/board-form';

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly addBoard$ = new Subject<BoardDto>();
  readonly editBoard$ = new Subject<BoardDto>();
  readonly deleteBoard$ = new Subject<{ boardId: string }>();

  readonly addThread$ = new Subject<{ threadForm: FormGroup; imageFileParameters: FileParameter[] }>();

  readonly downloadPostImages$ = new Subject<{ postId: string }>();
}
