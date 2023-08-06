import { Component, OnInit } from '@angular/core';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent extends MemoryLeaksProtectedComponent {
  constructor() {
    super();
  }
}
