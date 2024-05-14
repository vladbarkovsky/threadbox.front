import { Translatable } from '../translatable';
import { MessageStatus } from './message-status';

export interface Message extends Translatable {
  status: MessageStatus;
}
