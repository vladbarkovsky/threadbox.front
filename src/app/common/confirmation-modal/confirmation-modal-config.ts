import { Subject } from 'rxjs';

export interface ConfirmationModalConfig {
  title: string;
  text: string;
  data?: any;
  action$: Subject<any>;
}
