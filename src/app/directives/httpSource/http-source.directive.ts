import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Directive({
  selector: 'img[httpSource]',
})
export class HttpSourceDirective implements OnInit, OnDestroy {
  @Input() httpSource!: string;

  httpSubscription?: Subscription;

  constructor(private http: HttpClient, private renderer2: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    // TODO: Replace image hiding by CSS display property with ng-lazyload-image
    // https://www.npmjs.com/package/ng-lazyload-image

    // Hide the image until the server sends the file to client
    this.elementRef.nativeElement.style.setProperty('display', 'none', 'important');

    this.httpSubscription = this.http
      .get(environment.apiBaseUrl + this.httpSource, { responseType: 'blob' })
      .pipe(
        // Show image
        finalize(() => (this.elementRef.nativeElement.style.display = null))
      )
      .subscribe(blob => {
        // Add src attribute with file as Base64
        this.renderer2.setAttribute(this.elementRef.nativeElement, 'src', URL.createObjectURL(blob));
      });
  }

  ngOnDestroy(): void {
    this.httpSubscription?.unsubscribe();
  }
}
