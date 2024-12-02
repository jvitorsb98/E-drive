import { TestBed } from '@angular/core/testing';
import { LoginModule } from './login.module';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { SharedModule } from '../../../shared/shared.module';

describe('LoginModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        CommonModule,
        LoginRoutingModule,
        SharedModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(LoginModule);
    expect(module).toBeTruthy();
  });
});
