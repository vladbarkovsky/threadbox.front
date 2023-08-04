import { FormGroup } from '@angular/forms';

export abstract class GenericFormGroup<T> extends FormGroup {
  abstract get data(): T;
}
