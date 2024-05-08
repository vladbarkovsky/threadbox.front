export class SessionStorageFacade {
  static get lastUrl(): string | null {
    return sessionStorage.getItem('lastUrl');
  }

  static set lastUrl(value: string) {
    sessionStorage.setItem('lastUrl', value);
  }
}
