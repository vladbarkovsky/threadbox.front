import { FormControl, Validators } from '@angular/forms';
import { CreateSectionCommand } from '../../../../api-client';
import { GenericFormGroup } from '../../common/generic-form-group';

export class CreateSectionForm extends GenericFormGroup<CreateSectionCommand> {
  override get data(): CreateSectionCommand {
    return new CreateSectionCommand({
      title: this.title.value,
    });
  }

  get title(): FormControl<string> {
    return this.controls['title'] as FormControl<string>;
  }

  constructor() {
    super({
      title: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
    });
  }
}
