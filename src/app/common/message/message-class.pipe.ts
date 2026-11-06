import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { MessageStatus } from './message-status';

@Pipe({
	name: 'messageClass',
	standalone: true,
})
export class MessageClassPipe implements PipeTransform {
	transform(value: MessageStatus): string | undefined {
		return this.messageClassMap.get(value);
	}

	private readonly messageClassMap: Map<MessageStatus, string> = new Map<MessageStatus, string>([
		[MessageStatus.Info, 'alert-info'],
		[MessageStatus.Warning, 'alert-warning'],
		[MessageStatus.Error, 'alert-danger'],
	]);
}
