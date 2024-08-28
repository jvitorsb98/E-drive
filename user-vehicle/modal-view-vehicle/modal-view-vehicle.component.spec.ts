import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewVehicleComponent } from './modal-view-vehicle.component';

describe('ModalViewVehicleComponent', () => {
  let component: ModalViewVehicleComponent;
  let fixture: ComponentFixture<ModalViewVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalViewVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalViewVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
