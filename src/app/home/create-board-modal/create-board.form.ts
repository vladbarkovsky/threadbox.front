import { Validators, FormControl } from '@angular/forms';
import { GenericFormGroup } from '../../common/generic-form-group';
import { CreateBoardCommand } from '../../../../api-client';

export class CreateBoardForm extends GenericFormGroup<CreateBoardCommand> {
  override get data(): CreateBoardCommand {
    return new CreateBoardCommand({
      title: this.title.value,
      description: this.description.value,
    });
  }

  get title(): FormControl<string> {
    return this.controls['title'] as FormControl<string>;
  }

  get description(): FormControl<string> {
    return this.controls['description'] as FormControl<string>;
  }

  constructor() {
    super({
      title: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
      description: new FormControl<string>('', [Validators.required, Validators.maxLength(2048)]),
    });
  }
}
