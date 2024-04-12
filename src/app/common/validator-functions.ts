import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const passwordValidators: ValidatorFn[] = [Validators.required, Validators.minLength(8), Validators.maxLength(30)];

export function matchValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // This if statement resolves core.mjs:6495 error
    if (control.parent) {
      const controlToMatch = (control.parent?.controls as any)[matchTo] as AbstractControl;

      if (control.value !== controlToMatch.value) {
        return { matching: true };
      }
    }

    return null;
  };
}

// Regex: 1-128 ASCII characters (codes 33-34 and 36-126 - except '#') + '#' + 8-128 ASCII characters (codes 33-126).
export const tripcodeStringValidator = Validators.pattern(/^[!-"\$-~]{1,128}#[!-~]{8,128}$/);
