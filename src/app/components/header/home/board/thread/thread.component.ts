import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MemoryLeaksProtectedComponent } from 'src/app/components/memory-leaks-protected.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent extends MemoryLeaksProtectedComponent implements OnInit {
  @Output() downloadImagesEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
