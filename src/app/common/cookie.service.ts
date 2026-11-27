import { Service } from '@angular/core';
import { environment } from '../../environments/environment';

@Service()
export class CookieService {
	/**
	 * 400 days. Chrome, Edge, and Firefox cap a cookie Max-Age above that.
	 * Safari deletes a cookie written with document.cookie after 7 days of browser use without a visit.
	 *
	 * @private
	 * @link https://developer.chrome.com/blog/cookie-max-age-expires
	 * @link https://bugzilla.mozilla.org/show_bug.cgi?id=1964943
	 * @link https://webkit.org/tracking-prevention/
	 */
	private readonly informationCookieMaxAgeSeconds: number = 34560000;

	read(cookieName: string): string | null {
		// Regex: Matches "name=value" at the start or after "; " and captures the value up to the next ";".
		const pattern: RegExp = new RegExp(`(?:^|; )${cookieName}=([^;]*)`);

		const cookieMatch: RegExpMatchArray | null = pattern.exec(document.cookie);
		return cookieMatch?.[1] ?? null;
	}

	saveInformationCookie(cookieName: string, cookieValue: string): void {
		const informationCookieDomain: string =
			environment.informationCookieDomain === null ? '' : `Domain=${environment.informationCookieDomain}`;

		document.cookie =
			`${cookieName}=${cookieValue};` +
			` Path=/;` +
			` Max-Age=${this.informationCookieMaxAgeSeconds};` +
			` SameSite=Lax;` +
			` Secure;` +
			` ${informationCookieDomain}`;
	}
}
