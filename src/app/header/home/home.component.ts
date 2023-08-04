import { Component } from '@angular/core';
import { MemoryLeaksProtectedComponent } from '../../../common/memory-leaks-protected.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends MemoryLeaksProtectedComponent {}
