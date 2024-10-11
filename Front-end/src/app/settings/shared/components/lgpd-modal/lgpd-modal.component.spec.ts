import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LgpdModalComponent } from './lgpd-modal.component';

describe('LgpdModalComponent', () => {
  let component: LgpdModalComponent;
  let fixture: ComponentFixture<LgpdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LgpdModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LgpdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
