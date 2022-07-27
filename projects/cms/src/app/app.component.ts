import { Component, OnInit } from '@angular/core';
import { ConnectionCheckingService } from 'shared/services/connection-checking/connection-checking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private connectionChecking: ConnectionCheckingService) { }

  ngOnInit(): void {
    this.connectionChecking.checkConnection('https://localhost:44396/swagger');
  }
}
