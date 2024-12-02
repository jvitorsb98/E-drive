import { TestBed } from '@angular/core/testing';
import { HomeModule } from './home.module';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

describe('HomeModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HomeModule,
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(HomeModule);
    expect(module).toBeTruthy();
  });
});
