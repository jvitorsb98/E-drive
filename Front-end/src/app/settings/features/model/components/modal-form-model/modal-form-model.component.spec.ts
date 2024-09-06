import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormModelComponent } from './modal-form-model.component';

describe('ModalFormModelComponent', () => {
  let component: ModalFormModelComponent;
  let fixture: ComponentFixture<ModalFormModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
