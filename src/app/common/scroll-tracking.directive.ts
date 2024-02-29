import { DestroyRef, Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';

@Directive({
  selector: '[scroll-tracking]',
  standalone: true,
})
export class ScrollTrackingDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  @Output() readonly thresholdPassed = new EventEmitter<void>();

  private lastScrollPosition = 0;

  // TODO: Threshold 500 don't work sometimes. Investigate.
  private readonly threshold = 0;

  private readonly scrolling = new Subject<void>();

  constructor() {
    this.scrolling.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.checkIfThresholdPassed());
  }

  @HostListener('window:scroll') onScroll(): void {
    this.scrolling.next();
  }

  private checkIfThresholdPassed(): void {
    const elementHeight = this.elementRef.nativeElement.scrollHeight;
    const scrollPosition = window.innerHeight + window.scrollY;

    const scrollingDown = scrollPosition > this.lastScrollPosition;
    const lastBeforeThreshold = this.lastScrollPosition < elementHeight - this.threshold;
    const currentBeyondThreshold = scrollPosition >= elementHeight - this.threshold;

    if (scrollingDown && lastBeforeThreshold && currentBeyondThreshold) {
      this.thresholdPassed.emit();
    }

    this.lastScrollPosition = scrollPosition;
  }
}
