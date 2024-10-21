import { TestBed } from '@angular/core/testing';
import { TripPlannerMapsService } from './trip-planner-maps.service';


describe('TripPlannerMapsService', () => {
  let service: TripPlannerMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPlannerMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
