import { Component, DestroyRef, Input, ViewChild, inject } from '@angular/core';
import { NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { CreateThreadForm } from './create-thread.form';
import { ThreadsClient } from '../../../../api-client';
import { ImagesUploadState } from '../../common/images-upload/images-upload.state';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { convertToNSwagFileParameter } from '../../common/file-operations';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrl: './create-thread.component.scss',
  standalone: true,
  imports: [NgbCollapseModule, ImagesUploadComponent, ReactiveFormsModule],
  providers: [ImagesUploadState],
})
export class CreateThreadComponent {
  public readonly imagesUploadState = inject(ImagesUploadState);
  private readonly threadsClient = inject(ThreadsClient);
  private readonly destroyRef = inject(DestroyRef);

  @Input() boardId!: string;
  @ViewChild('collapse') ngbCollapse!: NgbCollapse;

  formCollapsed = true;
  createThreadForm = new CreateThreadForm();

  toggleCollapse(): void {
    this.ngbCollapse.toggle();

    if (this.formCollapsed) {
      this.imagesUploadState.reset();
    }
  }

  onSubmit(): void {
    this.imagesUploadState
      .getFiles()
      .pipe(
        switchMap(files => {
          return this.threadsClient.createThread(
            this.createThreadForm.title.value,
            this.createThreadForm.text.value,
            this.boardId,
            files.map(convertToNSwagFileParameter)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {},
        error: error => {
          console.log(error);
        },
      });
  }
}
