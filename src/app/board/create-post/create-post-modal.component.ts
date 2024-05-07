import { Component, DestroyRef, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagesUploadState } from '../../common/images-upload/images-upload.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostsClient } from '../../../../api-client';
import { CreatePostForm } from './create-post.form';
import { first, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { convertToNSwagFileParameter } from '../../common/file-operations';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, ImagesUploadComponent, TranslocoDirective],
  providers: [ImagesUploadState],
})
// TODO: Create non-modal window.
// Possible solution here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog.
export class CreatePostModalComponent {
  readonly imagesUploadState = inject(ImagesUploadState);
  private readonly ngbActiveModal = inject(NgbActiveModal);
  private readonly postsClient = inject(PostsClient);
  private readonly destroyRef = inject(DestroyRef);

  @Input() threadId!: string;
  readonly createPostForm = new CreatePostForm();

  close() {
    this.ngbActiveModal.dismiss();
  }

  onSubmit(): void {
    this.imagesUploadState
      .getFiles()
      .pipe(
        first(),
        switchMap(files =>
          this.postsClient.createPost(
            this.createPostForm.text.value,
            this.threadId,
            this.createPostForm.tripcodeString.value,
            files.map(convertToNSwagFileParameter)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.ngbActiveModal.close(),
        error: error => console.log(error),
      });
  }
}
