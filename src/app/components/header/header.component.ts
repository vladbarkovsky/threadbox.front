import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activePath!: string;
  isMenuCollapsed: boolean = true;

  constructor(public headerService: HeaderService, private router: Router) {}

  ngOnInit(): void {
    this.activePath = this.router.url.split('/')[2];
  }

  onLinkClick(linkPath: string): void {
    this.isMenuCollapsed = true;
    this.activePath = linkPath;
  }
}
