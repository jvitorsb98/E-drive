import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordModalComponent } from './user-password-modal.component';

describe('UserPasswordModalComponent', () => {
  let component: UserPasswordModalComponent;
  let fixture: ComponentFixture<UserPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPasswordModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
