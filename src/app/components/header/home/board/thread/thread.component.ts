import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListThreadDto } from 'api-client';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  @Input() thread!: ListThreadDto;

  @Output() downloadImagesEvent: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
