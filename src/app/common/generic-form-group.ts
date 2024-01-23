import { UntypedFormGroup } from '@angular/forms';

export abstract class GenericFormGroup<T> extends UntypedFormGroup {
  abstract get data(): T;
}
