import { Component, OnInit } from '@angular/core';
import { ConnectionClient } from 'api-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private connectionClient: ConnectionClient) { }

  ngOnInit(): void {
    this.connectionClient.check()
      .subscribe({
        error: () => {
          // Redirection to "Server unavailable" page
        }
      })
      .unsubscribe();
  }
}
