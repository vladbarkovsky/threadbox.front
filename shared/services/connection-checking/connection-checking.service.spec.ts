import { TestBed } from '@angular/core/testing';

import { ConnectionCheckingService } from './connection-checking.service';

describe('ConnectionCheckingService', () => {
  let service: ConnectionCheckingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionCheckingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
