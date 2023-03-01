import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Directive({
  selector: 'img[httpSource]',
})
export class HttpSourceDirective implements OnInit {
  @Input() httpSource!: string;

  constructor(private http: HttpClient, private renderer2: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Hide the image until the server sends the file to client
    this.elementRef.nativeElement.style.setProperty('display', 'none', 'important');

    const url = environment.apiBaseUrl + this.httpSource;

    this.http
      .get(url, { responseType: 'blob' })
      .pipe(
        // Show image
        finalize(() => (this.elementRef.nativeElement.style.display = null))
      )
      .subscribe(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = () => {
          // Add src attribute with file as Base64
          this.renderer2.setAttribute(this.elementRef.nativeElement, 'src', reader.result as string);
        };
      });
  }
}
