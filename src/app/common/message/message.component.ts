import { Component, Input } from '@angular/core';
import { Message } from './message';
import { TranslocoDirective } from '@ngneat/transloco';
import { MessageClassPipe } from './message-class.pipe';
import { NgClass } from '@angular/common';
import { MessageStatus } from './message-status';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  standalone: true,
  imports: [TranslocoDirective, MessageClassPipe, NgClass],
})
export class MessageComponent {
  @Input() message!: Message;

  readonly messageStatusEnum = MessageStatus;
}
