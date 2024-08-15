import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehicleListComponent } from './user-vehicle-list.component';

describe('UserVehicleListComponent', () => {
  let component: UserVehicleListComponent;
  let fixture: ComponentFixture<UserVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserVehicleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
