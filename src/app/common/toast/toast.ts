import { ToastStatus } from './toast-status';
import { Translatable } from '../translatable';

export interface Toast extends Translatable {
  status: ToastStatus;
}
