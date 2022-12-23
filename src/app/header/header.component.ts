import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activePath!: string;

  readonly links = [
    { title: 'Home', path: 'home' },
    { title: 'Authorization', path: 'authorization' },
  ];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.activePath = this.router.url.split('/').pop()!;
  }
}
