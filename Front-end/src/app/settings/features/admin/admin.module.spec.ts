import { TestBed } from '@angular/core/testing';
import { AdminModule } from './admin.module';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

describe('AdminModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AdminModule,
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(AdminModule);
    expect(module).toBeTruthy();
  });
});
