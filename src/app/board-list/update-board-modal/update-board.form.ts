import { UntypedFormControl, AbstractControl, Validators } from '@angular/forms';
import { BoardDto, UpdateBoardCommand } from '../../../../api-client';
import { GenericFormGroup } from '../../common/generic-form-group';

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
      title: new UntypedFormControl(boardDto.title, [Validators.required, Validators.maxLength(128)]),
      description: new UntypedFormControl(boardDto.description, [Validators.required, Validators.maxLength(2048)]),
    });

    this.id = boardDto.id;
  }
}
