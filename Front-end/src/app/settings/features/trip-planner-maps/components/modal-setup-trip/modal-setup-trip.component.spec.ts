import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSetupTripComponent } from './modal-setup-trip.component';

describe('ModalSetupTripComponent', () => {
  let component: ModalSetupTripComponent;
  let fixture: ComponentFixture<ModalSetupTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSetupTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSetupTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
