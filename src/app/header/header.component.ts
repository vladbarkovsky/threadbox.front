import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from 'src/app/identity/identity.service';
import { MemoryLeaksProtectedComponent } from '../../common/memory-leaks-protected.component';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends MemoryLeaksProtectedComponent implements OnInit {
  activePath!: string;
  isCollapsed: boolean = true;

  constructor(public headerService: HeaderService, public authenticationService: IdentityService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.activePath = this.router.url.split('/')[2];
  }

  onLinkClick(linkPath: string): void {
    this.activePath = linkPath;
    this.isCollapsed = true;
  }
}
