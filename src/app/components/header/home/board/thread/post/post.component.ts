import { Component, Input, OnInit } from '@angular/core';
import { ListPostDto } from 'api-client';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post!: ListPostDto;

  constructor(public eventService: EventService) {}

  ngOnInit(): void {}
}
