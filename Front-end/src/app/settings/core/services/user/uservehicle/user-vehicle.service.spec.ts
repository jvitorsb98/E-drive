import { TestBed } from '@angular/core/testing';

import { UserVehicleService } from './user-vehicle.service';

describe('UserVehicleService', () => {
  let service: UserVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
