import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVehicleBatteryComponent } from './modal-vehicle-battery.component';

describe('ModalVehicleBatteryComponent', () => {
  let component: ModalVehicleBatteryComponent;
  let fixture: ComponentFixture<ModalVehicleBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalVehicleBatteryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVehicleBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
