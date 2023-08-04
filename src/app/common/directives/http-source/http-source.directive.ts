import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MemoryLeaksProtectedDirective } from '../memory-leaks-protected.directive';

@Directive({
  selector: 'img[httpSource]',
})
export class HttpSourceDirective extends MemoryLeaksProtectedDirective implements OnInit {
  @Input() httpSource!: string;

  constructor(private http: HttpClient, private renderer2: Renderer2, private elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    // TODO: Replace image hiding by CSS display property with ng-lazyload-image
    // https://www.npmjs.com/package/ng-lazyload-image

    // Hide the image until the server sends the file to client
    this.elementRef.nativeElement.style.setProperty('display', 'none', 'important');

    this.http
      .get(this.httpSource, { responseType: 'blob' })
      .pipe(
        takeUntil(this.destroyed$),
        // Show image
        finalize(() => (this.elementRef.nativeElement.style.display = null))
      )
      .subscribe(blob => {
        // Add src attribute with file as Base64
        this.renderer2.setAttribute(this.elementRef.nativeElement, 'src', URL.createObjectURL(blob));
      });
  }
}
