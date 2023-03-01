import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread.component';
import { PostModule } from './post/post.module';
import { HttpSourceModule } from 'src/app/directives/httpSource/http-source.module';

@NgModule({
  declarations: [ThreadComponent],
  imports: [CommonModule, HttpSourceModule, PostModule],
  exports: [ThreadComponent],
})
export class ThreadModule {}
