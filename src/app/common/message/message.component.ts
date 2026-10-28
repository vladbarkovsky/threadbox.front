import { Component, Input } from '@angular/core';
import { Message } from './message';
import { TranslatePipe } from '../localization/translate.pipe';
import { MessageClassPipe } from './message-class.pipe';
import { NgClass } from '@angular/common';
import { MessageStatus } from './message-status';
import { TranslationKey } from '../localization/translation-key.enum';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss',
	standalone: true,
	imports: [TranslatePipe, MessageClassPipe, NgClass],
})
export class MessageComponent {
	@Input() message!: Message;

	readonly messageStatusEnum = MessageStatus;
	readonly translationKey = TranslationKey;
}
