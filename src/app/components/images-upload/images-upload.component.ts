import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileParameter } from 'api-client';
import { MemoryLeaksProtectedComponent } from '../memory-leaks-protected.component';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
})
export class ImagesUploadComponent extends MemoryLeaksProtectedComponent implements OnInit {
  /**
   * Form with file input for images. Can be used for validating form that contains image upload
   *
   * @type {FormGroup}
   * @memberof ImagesUploadComponent
   */
  imagesForm: FormGroup = this.formBuilder.group({ imagesInput: [''] });

  /**
   * Strings used as sources for displaying uploaded images in HTML
   *
   * @type {string[]}
   * @memberof ImagesUploadComponent
   */
  base64Urls: string[] = [];

  imageFiles: File[] = [];

  /**
   * Returns image files mapped for sending to server
   *
   * @readonly
   * @type {FileParameter[]}
   * @memberof ImagesUploadComponent
   */
  get imageFileParameters(): FileParameter[] {
    return this.imageFiles.map(x => ({ data: x, fileName: x.name }));
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {}

  onFileChange(fileInput: HTMLInputElement) {
    const imageFiles: File[] = Array.from(fileInput.files!);
    this.imageFiles.push(...imageFiles.filter(image => !this.imageFiles.some(x => x.name === image.name)));

    if (this.imageFiles && this.imageFiles[0]) {
      for (let i = 0; i < this.imageFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = event => {
          this.base64Urls.push(event.target?.result as string);
        };

        reader.readAsDataURL(this.imageFiles[i]);
      }
    }
  }

  deleteImage(index: number) {
    this.imageFiles.slice(index, 1);
    this.base64Urls.slice(index, 1);
  }
}
