import { TestBed } from '@angular/core/testing';
import { FragmentsModule } from './fragments.module';
import { CommonModule } from '@angular/common';
import { FragmentsRoutingModule } from './fragments-routing.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

describe('FragmentsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FragmentsModule,
        CommonModule,
        FragmentsRoutingModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(FragmentsModule);
    expect(module).toBeTruthy();
  });
});
