import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { JoinPipe } from '../pipes/join.pipe';
import { Base64File } from './base64-file';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, JoinPipe],
})
export class ImagesUploadComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() files$!: Subject<File[]>;
  @Input() maxCount!: number;

  readonly allowedFormats: string[] = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/svg+xml'];
  base64Files: Base64File[] = [];

  ngOnInit(): void {
    this.files$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(x => {
      if (!x.length) {
        this.base64Files = [];
      }
    });
  }

  onFileInputChange(fileInput: HTMLInputElement): void {
    // Getting images uploaded to file input.
    let files: File[] = Array.from(fileInput.files!);

    if (this.base64Files.length + files.length > this.maxCount) {
      files = files.slice(0, this.maxCount - this.base64Files.length);
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
          const base64 = event.target!.result as string;
          this.base64Files.push({ file: file, base64: base64 });
        };

        reader.readAsDataURL(file);
      });

      this.files$.next(files);
    }
  }

  deleteFile(fileName: string): void {
    this.base64Files = this.base64Files.filter(x => x.file.name !== fileName);
    this.files$.next(this.base64Files.map(x => x.file));
  }

  deleteFiles(): void {
    this.files$.next([]);
  }
}
