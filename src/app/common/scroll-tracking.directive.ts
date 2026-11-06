import { DestroyRef, Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';

@Directive({
	selector: '[appScrollTracking]',
	standalone: true,
})
export class ScrollTrackingDirective {
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	@Output() readonly thresholdPassed: EventEmitter<void> = new EventEmitter<void>();

	private lastScrollPosition: number = 0;

	// TODO: Threshold 500 don't work sometimes. Investigate.
	// Possible solution: use relative threshold.
	private readonly threshold: number = 0;

	private readonly scrolling: Subject<void> = new Subject<void>();

	constructor() {
		this.scrolling.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe((): void => {
			this.checkIfThresholdPassed();
		});
	}

	@HostListener('window:scroll') onScroll(): void {
		this.scrolling.next();
	}

	private checkIfThresholdPassed(): void {
		const elementHeight: number = this.elementRef.nativeElement.scrollHeight;
		const scrollPosition: number = window.innerHeight + window.scrollY;
		const scrollingDown: boolean = scrollPosition > this.lastScrollPosition;
		const lastBeforeThreshold: boolean = this.lastScrollPosition < elementHeight - this.threshold;
		const currentBeyondThreshold: boolean = scrollPosition >= elementHeight - this.threshold;

		if (scrollingDown && lastBeforeThreshold && currentBeyondThreshold) {
			this.thresholdPassed.emit();
		}

		this.lastScrollPosition = scrollPosition;
	}
}
