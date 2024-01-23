import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  standalone: true,
})
export class ThreadComponent {
  @Output() downloadImagesEvent: EventEmitter<string> = new EventEmitter();
}
