import { HeaderLink } from './header-link';

export const linksForAuthorizedUsers: HeaderLink[] = [
  { title: 'Home', path: 'home' },
  { title: 'Authorization', path: 'identity' },
];

export const linksForUnauthorizedUsers: HeaderLink[] = [{ title: 'Home', path: 'home' }];
