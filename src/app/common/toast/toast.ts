import type { ToastStatus } from './toast-status';
import type { Translatable } from '../translatable';

export interface Toast extends Translatable {
	status: ToastStatus;
}
