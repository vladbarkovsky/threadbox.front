import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'validationErrors',
  standalone: true,
})
export class ValidationErrorsPipe implements PipeTransform {
  transform(abstractControl: AbstractControl): ValidationErrors {
    if ((abstractControl.dirty || abstractControl.touched) && abstractControl.errors) {
      return abstractControl.errors;
    }

    return {};
  }
}
