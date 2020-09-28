import { TestBed } from '@angular/core/testing';

import { CollaboraterService } from './collaborater.service';

describe('CollaboraterService', () => {
  let service: CollaboraterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboraterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
