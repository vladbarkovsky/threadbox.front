import { Component, Input, OnInit } from '@angular/core';
import { ListPostDto } from 'api-client';
import { MemoryLeaksProtectedComponent } from 'src/app/components/memory-leaks-protected.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends MemoryLeaksProtectedComponent implements OnInit {
  @Input() post!: ListPostDto;

  constructor(public eventService: EventService) {
    super();
  }

  ngOnInit(): void {}
}
