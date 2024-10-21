import { TestBed } from '@angular/core/testing';

import { CategoryAvgAutonomyStatsService } from './category-avg-autonomy-stats.service';

describe('CategoryAvgAutonomyStatsService', () => {
  let service: CategoryAvgAutonomyStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryAvgAutonomyStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
