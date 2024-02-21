import { Component, Input, inject } from '@angular/core';
import { Base64File } from './image-file';
import { ToastService } from '../toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JoinPipe } from '../pipes/join.pipe';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, JoinPipe],
})
export class ImagesUploadComponent {
  private readonly toastService = inject(ToastService);

  @Input() formControl!: FormControl<File[]>;
  @Input() maxCount: number | undefined;

  readonly allowedFormats: string[] = ['image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'];
  files: Base64File[] = [];

  onChange(fileInput: HTMLInputElement): void {
    // Getting images uploaded to file input.
    let files: File[] = Array.from(fileInput.files!);

    // TODO: Check if required.
    if (!files.length) {
      return;
    }

    if (this.maxCount && files.length > this.maxCount) {
      files = files.slice(0, this.maxCount);
      this.toastService.showWarningToast(`Maximum allowed number of files is ${this.maxCount}.`);
    }

    if (files.length) {
      files.forEach(file => {
        if (!this.allowedFormats.includes(file.type)) {
          this.toastService.showErrorToast(`File ${file.name} is not supported and was excluded from selection.`);
          return;
        }

        // We create reader for each uploaded image to get it's Base64 representation,
        // because we want to show uploaded images in HTML.
        const reader = new FileReader();

        reader.onload = event => {
          const base64 = event.target?.result as string;
          this.files.push({ ...file, base64: base64 });
        };

        reader.readAsDataURL(file);
      });
    }
  }

  deleteFile(fileName: string) {
    this.formControl.patchValue(this.formControl.value.filter(x => x.name !== fileName));
    this.files = this.files.filter(x => x.name !== fileName);
  }
}
