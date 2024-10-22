import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectAddressComponent } from './modal-select-address.component';

describe('ModalSelectAddressComponent', () => {
  let component: ModalSelectAddressComponent;
  let fixture: ComponentFixture<ModalSelectAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSelectAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSelectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
