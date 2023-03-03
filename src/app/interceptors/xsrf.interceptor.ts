import { HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  private actions: string[] = ['POST', 'PUT', 'DELETE'];
  private forbiddenActions: string[] = ['HEAD', 'OPTIONS'];

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenExtractor.getToken();
    const permitted = this.findByActionName(request.method, this.actions);
    const forbidden = this.findByActionName(request.method, this.forbiddenActions);

    if (permitted !== undefined && forbidden === undefined && token !== null) {
      request = request.clone({ setHeaders: { 'XSRF-TOKEN': token } });
    }

    return next.handle(request);
  }

  private findByActionName(name: string, actions: string[]): string | undefined {
    return actions.find(action => action.toLocaleLowerCase() === name.toLocaleLowerCase());
  }
}
