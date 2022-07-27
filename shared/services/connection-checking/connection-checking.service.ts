import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionCheckingService {
  constructor(private http: HttpClient) { }

  checkConnection(url: string) {
    this.http.get(url, { observe: 'response' })
      .pipe(first())
      .subscribe(
        response => {
          if (response.status === 200) {
            console.log(true);
          } else {
            console.log(false);
          }
        },
        error => console.log(error)
      )
      .unsubscribe();
  }
}