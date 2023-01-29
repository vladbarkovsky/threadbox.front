import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { ApiUrlModule } from 'src/app/pipes/api-url.module';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, ApiUrlModule],
  exports: [PostComponent],
})
export class PostModule {}
