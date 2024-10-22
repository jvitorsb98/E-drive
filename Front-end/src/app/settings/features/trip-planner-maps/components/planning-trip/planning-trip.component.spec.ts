import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningTripComponent } from './planning-trip.component';

describe('PlanningTripComponent', () => {
  let component: PlanningTripComponent;
  let fixture: ComponentFixture<PlanningTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanningTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
