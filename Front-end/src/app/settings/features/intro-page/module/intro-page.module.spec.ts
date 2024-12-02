import { TestBed } from '@angular/core/testing';
import { IntroPageModule } from './intro-page.module';
import { CommonModule } from '@angular/common';
import { IntroPageRoutingModule } from './intro-page-routing.module';
import { FragmentsModule } from '../../../core/fragments/fragments.module';
import { SharedModule } from '../../../shared/shared.module';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';

describe('IntroPageModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IntroPageModule,
        CommonModule,
        IntroPageRoutingModule,
        FragmentsModule,
        SharedModule,
        AngularMaterialModule
      ]
    });
  });

  it('should create', () => {
    const module = TestBed.inject(IntroPageModule);
    expect(module).toBeTruthy();
  });
});
