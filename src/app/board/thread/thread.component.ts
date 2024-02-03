import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { ThreadState } from './thread.state';
import { AsyncPipe } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PostDto, PostsClient, ThreadDto } from '../../../../api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
  standalone: true,
  imports: [LazyLoadImageModule, AsyncPipe],
  providers: [ThreadState],
})
export class ThreadComponent implements OnInit {
  private readonly postsClient = inject(PostsClient);
  private readonly threadState = inject(ThreadState);
  private readonly destroyRef = inject(DestroyRef);

  @Input() thread!: ThreadDto;

  posts$: Observable<PostDto[]> = this.threadState.getPosts();

  allPostsLoaded = false;

  ngOnInit(): void {
    this.allPostsLoaded = !this.thread.hasMorePosts;
    this.threadState.setPosts(this.thread.posts!);
  }

  togglePosts(): void {
    if (!this.allPostsLoaded) {
      this.postsClient
        .getPostsByThread(this.thread.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: posts => {
            this.threadState.setPosts(posts);
            this.allPostsLoaded = true;
          },
          error: error => console.log(error),
        });
    } else {
      this.threadState.hidePosts();
      this.allPostsLoaded = false;
    }
  }
}
