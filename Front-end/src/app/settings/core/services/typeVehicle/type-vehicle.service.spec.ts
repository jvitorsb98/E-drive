import { TestBed } from '@angular/core/testing';

import { TypeVehicleService } from './type-vehicle.service';

describe('TypeVehicleService', () => {
  let service: TypeVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
