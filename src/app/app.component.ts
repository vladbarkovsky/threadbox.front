import { Component } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ToastComponent, RouterOutlet],
})
export class AppComponent {}
