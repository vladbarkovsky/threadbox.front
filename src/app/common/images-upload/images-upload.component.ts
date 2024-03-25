import { Component, Input, inject } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { JoinPipe } from '../pipes/join.pipe';
import { Base64File } from './base64-file';
import { Observable } from 'rxjs';
import { ImagesUploadState } from './images-upload.state';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, JoinPipe, AsyncPipe],
})
export class ImagesUploadComponent {
  private readonly toastService = inject(ToastService);

  @Input() imagesUploadState!: ImagesUploadState;
  @Input() maxCount!: number;

  /**
   * Required for multiple component instances.
   * Must be unique for each component instance.
   *
   * @type {string}
   * @memberof ImagesUploadComponent
   */
  @Input() fileInputId!: string;

  get base64Files$(): Observable<Base64File[]> {
    return this.imagesUploadState.getBase64Files();
  }

  readonly allowedFormats: string[] = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/svg+xml'];

  onFileInputChange($event: Event): void {
    const fileInput = $event.target as HTMLInputElement;
    let files = Array.from(fileInput.files!);

    files.forEach((file, i) => {
      if (this.imagesUploadState.base64Files.find(x => x.file.name === file.name)) {
        files.splice(i, 1);
        this.toastService.showWarningToast(`File with name ${file.name} is already added.`);
      }

      if (!this.allowedFormats.includes(file.type)) {
        files.splice(i, 1);
        this.toastService.showWarningToast(`File ${file.name} is not supported and was excluded from selection.`);
      }
    });

    if (this.imagesUploadState.base64Files.length + files.length > this.maxCount) {
      files = files.slice(0, this.maxCount - this.imagesUploadState.base64Files.length);
      this.toastService.showWarningToast(`Maximum allowed number of files is ${this.maxCount}.`);
    }

    if (files.length) {
      files.forEach(file => {
        // We create reader for each uploaded image to get it's Base64 representation,
        // because we want to show uploaded images in HTML.
        const reader = new FileReader();

        reader.onload = event => {
          const base64 = event.target!.result as string;
          this.imagesUploadState.addBase64File({ file: file, base64: base64 });
        };

        reader.readAsDataURL(file);
      });
    }

    // Clearing file input.
    fileInput.value = '';
  }

  deleteFile(fileName: string): void {
    this.imagesUploadState.deleteFile(fileName);
  }

  deleteFiles(): void {
    this.imagesUploadState.reset();
  }
}
