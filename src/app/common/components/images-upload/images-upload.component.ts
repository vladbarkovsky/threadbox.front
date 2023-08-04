import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemoryLeaksProtectedComponent } from '../memory-leaks-protected.component';
import { ImageFile } from './image-file';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
})
export class ImagesUploadComponent extends MemoryLeaksProtectedComponent implements OnInit {
  /**
   * Form with file input for images.
   *
   * @type {FormGroup}
   * @memberof ImagesUploadComponent
   */
  imagesForm: FormGroup = this.formBuilder.group({ imagesInput: [''] });

  imageFiles: ImageFile[] = [];

  constructor(private formBuilder: FormBuilder, private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {}

  onFileChange(fileInput: HTMLInputElement) {
    // Getting images uploaded to file input
    const files: File[] = Array.from(fileInput.files!);

    if (files && files[0]) {
      files.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.toastService.error(`File ${file.name} is not an image.`);
          return;
        }

        // We create reader for each uploaded image to get it's Base64 representation,
        // because we want to show uploaded images in HTML
        const reader = new FileReader();

        reader.onload = event => {
          const base64 = event.target?.result as string;
          const fileIsAlreadyAdded = this.imageFiles.some(x => x.base64 === base64);

          if (fileIsAlreadyAdded) {
            return;
          }

          this.imageFiles.push({ file, base64 });
        };

        reader.readAsDataURL(file);
      });
    }
  }

  deleteImage(imageFile: ImageFile) {
    this.imageFiles = this.imageFiles.filter(x => x !== imageFile);
  }
}
