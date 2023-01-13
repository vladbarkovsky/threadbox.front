import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-images-upload',
  templateUrl: './images-upload.component.html',
  styleUrls: ['./images-upload.component.scss'],
})
export class ImagesUploadComponent implements OnInit {
  images: string[] = [];

  imagesForm = this.formBuilder.group({
    file: [''],
    fileSource: [''],
  });

  get controls() {
    return this.imagesForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.images.push(event.target.result);

          this.imagesForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }

      this.imagesForm.controls['file'].reset();
    }
  }

  deleteImage(image: string) {
    this.images = this.images.filter(x => x !== image);

    this.imagesForm.patchValue({
      fileSource: this.images,
    });
  }
}
