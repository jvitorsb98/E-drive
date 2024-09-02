import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsAddressComponent } from './modal-details-address.component';

describe('ModalDetailsAddressComponent', () => {
  let component: ModalDetailsAddressComponent;
  let fixture: ComponentFixture<ModalDetailsAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailsAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
