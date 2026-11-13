import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizationService } from '../../localization/localization.service';
import { TranslatePipe } from '../../localization/pipes/translate.pipe';
import { TranslationKeys } from '../../localization/translations/translation-keys.enum';
import { SessionStorageService } from '../../common/session-storage-service';

const countdownStartSeconds: number = 5;

@Component({
	selector: 'app-logged-out',
	templateUrl: './logged-out.component.html',
	imports: [TranslatePipe],
})
export class LoggedOutComponent implements OnInit, OnDestroy {
	private readonly router: Router = inject(Router);
	private readonly sessionStorageService: SessionStorageService = inject(SessionStorageService);
	private readonly localizationService: LocalizationService = inject(LocalizationService);

	protected readonly remainingSeconds: WritableSignal<number> = signal<number>(countdownStartSeconds);
	protected readonly translationKeys: typeof TranslationKeys = TranslationKeys;
	private countdownIntervalId: ReturnType<typeof setInterval> | undefined;

	ngOnInit(): void {
		this.countdownIntervalId = setInterval((): void => {
			const nextRemainingSeconds: number = this.remainingSeconds() - 1;
			this.remainingSeconds.set(nextRemainingSeconds);

			if (nextRemainingSeconds <= 0) {
				this.redirect();
			}
		}, 1000);
	}

	ngOnDestroy(): void {
		this.clearCountdown();
	}

	private redirect(): void {
		this.clearCountdown();
		const lastUrl: string | null = this.sessionStorageService.lastUrl;

		if (lastUrl !== null && lastUrl !== '' && !this.isLoggedOutPath(lastUrl)) {
			void this.router.navigateByUrl(lastUrl);
			return;
		}

		void this.router.navigate(['/', this.localizationService.activeLanguage()]);
	}

	private isLoggedOutPath(url: string): boolean {
		const path: string = url.split('?')[0] ?? url;
		return path.endsWith('/logged-out');
	}

	private clearCountdown(): void {
		if (this.countdownIntervalId === undefined) {
			return;
		}

		clearInterval(this.countdownIntervalId);
		this.countdownIntervalId = undefined;
	}
}
