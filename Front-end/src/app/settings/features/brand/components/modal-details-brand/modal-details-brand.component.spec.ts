import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsBrandComponent } from './modal-details-brand.component';

describe('ModalDetailsBrandComponent', () => {
  let component: ModalDetailsBrandComponent;
  let fixture: ComponentFixture<ModalDetailsBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsBrandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailsBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
