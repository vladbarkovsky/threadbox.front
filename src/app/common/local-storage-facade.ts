export class LocalStorageFacade {
  static get language(): string | null {
    return localStorage.getItem('language');
  }

  static set language(value: string) {
    localStorage.setItem('language', value);
  }
}
