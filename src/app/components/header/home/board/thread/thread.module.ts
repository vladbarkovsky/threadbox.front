import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread.component';
import { PostModule } from './post/post.module';

@NgModule({
  declarations: [ThreadComponent],
  imports: [CommonModule, PostModule],
  exports: [ThreadComponent],
})
export class ThreadModule {}
