import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsVehicleComponent } from './modal-details-vehicle.component';

describe('ModalDetailsVehicleComponent', () => {
  let component: ModalDetailsVehicleComponent;
  let fixture: ComponentFixture<ModalDetailsVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailsVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
