import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[autoResize]',
})
export class AutoResizeDirective {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  @HostListener(':input') onInput() {
    this.resize();
  }

  private resize() {
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = `${this.elementRef.nativeElement.scrollHeight}px`;
  }
}
