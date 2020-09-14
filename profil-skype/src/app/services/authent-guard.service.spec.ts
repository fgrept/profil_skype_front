import { TestBed } from '@angular/core/testing';

import { AuthentGuardService } from './authent-guard.service';

describe('AuthentGuardService', () => {
  let service: AuthentGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
