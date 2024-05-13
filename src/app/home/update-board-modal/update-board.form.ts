import { Validators, FormControl } from '@angular/forms';
import { BoardDto, UpdateBoardCommand } from '../../../../api-client';
import { GenericFormGroup } from '../../common/generic-form-group';

export class UpdateBoardForm extends GenericFormGroup<UpdateBoardCommand> {
  override get data(): UpdateBoardCommand {
    return new UpdateBoardCommand({
      id: this.id,
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

  private id: string;

  constructor(boardDto: BoardDto) {
    super({
      title: new FormControl<string>(boardDto.title!, [Validators.required, Validators.maxLength(128)]),
      description: new FormControl<string>(boardDto.description!, [Validators.required, Validators.maxLength(2048)]),
    });

    this.id = boardDto.id!;
  }
}
