import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { HttpSourceModule } from 'src/app/directives/httpSource/http-source.module';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, HttpSourceModule],
  exports: [PostComponent],
})
export class PostModule {}
