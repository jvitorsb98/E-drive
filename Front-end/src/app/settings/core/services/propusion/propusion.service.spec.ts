import { TestBed } from '@angular/core/testing';

import { PropusionService } from './propusion.service';

describe('PropusionService', () => {
  let service: PropusionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropusionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
