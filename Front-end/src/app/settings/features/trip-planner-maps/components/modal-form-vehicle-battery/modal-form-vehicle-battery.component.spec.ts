import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormVehicleBatteryComponent } from './modal-form-vehicle-battery.component';

describe('ModalFormVehicleBatteryComponent', () => {
  let component: ModalFormVehicleBatteryComponent;
  let fixture: ComponentFixture<ModalFormVehicleBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormVehicleBatteryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormVehicleBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
