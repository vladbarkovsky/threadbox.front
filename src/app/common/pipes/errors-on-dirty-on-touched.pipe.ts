import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorsOnDirtyOrTouched',
  pure: true,
})
export class ErrorsOnDirtyOrTouchedPipe implements PipeTransform {
  transform(abstractControl: AbstractControl): ValidationErrors | undefined {
    if ((abstractControl.dirty || abstractControl.touched) && abstractControl.errors) {
      return abstractControl.errors;
    }

    return;
  }
}
