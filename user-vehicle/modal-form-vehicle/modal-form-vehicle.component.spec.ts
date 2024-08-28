import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormVehicleComponent } from './modal-form-vehicle.component';

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
