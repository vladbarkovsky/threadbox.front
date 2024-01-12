import { UntypedFormControl, AbstractControl, Validators } from '@angular/forms';
import { GenericFormGroup } from '../../common/generic-form-group';
import { CreateBoardCommand } from '../../../../api-client';

export class CreateBoardForm extends GenericFormGroup<CreateBoardCommand> {
  get data(): CreateBoardCommand {
    return new CreateBoardCommand({
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

  constructor() {
    super({
      title: new UntypedFormControl('', [Validators.required, Validators.maxLength(128)]),
      description: new UntypedFormControl('', [Validators.required, Validators.maxLength(2048)]),
    });
  }
}
