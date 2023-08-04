import { Component, OnInit } from '@angular/core';
import { MemoryLeaksProtectedComponent } from '../../../common/memory-leaks-protected.component';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent extends MemoryLeaksProtectedComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
