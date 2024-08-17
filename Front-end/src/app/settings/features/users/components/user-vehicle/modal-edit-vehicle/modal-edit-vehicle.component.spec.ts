import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditVehicleComponent } from './modal-edit-vehicle.component';

describe('ModalEditVehicleComponent', () => {
  let component: ModalEditVehicleComponent;
  let fixture: ComponentFixture<ModalEditVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
