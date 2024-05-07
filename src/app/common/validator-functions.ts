import { Validators } from '@angular/forms';

// Regex: 1-128 ASCII characters (codes 33-34 and 36-126 - except '#') + '#' + 8-128 ASCII characters (codes 33-126).
export const tripcodeStringValidator = Validators.pattern(/^[!-"\$-~]{1,128}#[!-~]{8,128}$/);
