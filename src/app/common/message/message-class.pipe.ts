import { Pipe, PipeTransform } from '@angular/core';
import { MessageStatus } from './message-status';

@Pipe({
  name: 'messageClass',
  standalone: true,
})
export class MessageClassPipe implements PipeTransform {
  transform(value: MessageStatus) {
    return this.messageClassMap.get(value);
  }

  private readonly messageClassMap = new Map<MessageStatus, string>([
    [MessageStatus.Info, 'alert-info'],
    [MessageStatus.Warning, 'alert-warning'],
    [MessageStatus.Error, 'alert-danger'],
  ]);
}
