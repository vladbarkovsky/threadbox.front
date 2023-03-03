import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { API_BASE_URL } from 'api-client';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from './components/toast/toast.module';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { XsrfInterceptor } from './interceptors/xsrf.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule, ToastModule],
  providers: [
    { provide: API_BASE_URL, useFactory: () => environment.apiBaseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
