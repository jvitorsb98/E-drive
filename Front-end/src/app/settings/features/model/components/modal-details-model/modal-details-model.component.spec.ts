import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsModelComponent } from './modal-details-model.component';

describe('ModalDetailsModelComponent', () => {
  let component: ModalDetailsModelComponent;
  let fixture: ComponentFixture<ModalDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
