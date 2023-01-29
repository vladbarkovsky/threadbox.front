import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread.component';
import { PostComponent } from './post/post.component';
import { PostModule } from './post/post.module';
import { ApiUrlModule } from 'src/app/pipes/api-url.module';

@NgModule({
  declarations: [ThreadComponent],
  imports: [CommonModule, PostModule, ApiUrlModule],
  exports: [ThreadComponent],
})
export class ThreadModule {}
