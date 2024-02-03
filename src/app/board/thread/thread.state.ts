import { Injectable } from '@angular/core';
import { PostDto } from '../../../../api-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ThreadState {
  private readonly posts$ = new BehaviorSubject<PostDto[]>([]);

  getPosts(): Observable<PostDto[]> {
    return this.posts$.asObservable();
  }

  setPosts(posts: PostDto[]): void {
    this.posts$.next(posts);
  }

  hidePosts() {
    this.posts$.next(this.posts$.value.slice(0, 3));
  }
}
