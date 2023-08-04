import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { BoardDto } from 'api-client';

export class BoardForm extends FormGroup {
  constructor(boardDto?: BoardDto) {
    super({
      id: new FormControl(boardDto?.id ?? undefined),
      title: new FormControl(boardDto?.title ?? '', Validators.required),
      description: new FormControl(boardDto?.description ?? ''),
    });
  }

  get id(): AbstractControl {
    return this.controls['id'];
  }

  get title(): AbstractControl {
    return this.controls['title'];
  }

  get description(): AbstractControl {
    return this.controls['description'];
  }

  get boardDto(): BoardDto {
    console.log(this.id.value);

    return new BoardDto({
      id: this.id.value,
      title: this.title.value,
      description: this.description.value,
    });
  }
}
