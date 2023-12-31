import { FormControl, AbstractControl, Validators } from '@angular/forms';
import { BoardDto, UpdateBoardCommand } from 'api-client';
import { GenericFormGroup } from 'src/app/common/generic-form-group';

export class UpdateBoardForm extends GenericFormGroup<UpdateBoardCommand> {
  get data(): UpdateBoardCommand {
    return new UpdateBoardCommand({
      id: this.id,
      title: this.title.value,
      description: this.description.value,
    });
  }

  get title(): AbstractControl {
    return this.controls['title'];
  }

  get description(): AbstractControl {
    return this.controls['description'];
  }

  private id: string | undefined;

  constructor(boardDto: BoardDto) {
    super({
      title: new FormControl(boardDto.title, [Validators.required, Validators.maxLength(128)]),
      description: new FormControl(boardDto.description, [Validators.required, Validators.maxLength(2048)]),
    });

    this.id = boardDto.id;
  }
}
