import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListThreadDto } from 'api-client';
import { BaseComponent } from 'src/app/components/base.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent extends BaseComponent implements OnInit {
  @Input() thread!: ListThreadDto;

  @Output() downloadImagesEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
