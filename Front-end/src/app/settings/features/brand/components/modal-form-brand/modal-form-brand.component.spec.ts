import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormBrandComponent } from './modal-form-brand.component';

describe('ModalFormBrandComponent', () => {
  let component: ModalFormBrandComponent;
  let fixture: ComponentFixture<ModalFormBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormBrandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
