import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastComponent } from './common/toast/toast.component';
import { RouterOutlet } from '@angular/router';

@Component({
	imports: [ToastComponent, RouterOutlet],
	selector: 'app-root',
	standalone: true,
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
