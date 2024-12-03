import { TestBed } from '@angular/core/testing';
import { UserVehicleModule } from './user-vehicle.module';
import { CommonModule } from '@angular/common';
import { UserVehicleRoutingModule } from './user-vehicle-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

describe('UserVehicleModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UserVehicleModule,
        CommonModule,
        UserVehicleRoutingModule,
        SharedModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(UserVehicleModule);
    expect(module).toBeTruthy();
  });
});
