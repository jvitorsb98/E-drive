import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './settings/angular-material/angular-material.module';
import { SharedModule } from './settings/shared/shared.module';
import { FragmentsModule } from './settings/core/fragments/fragments.module';
import { IntroPageModule } from './settings/features/intro-page/module/intro-page.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('AppModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        FragmentsModule,
        IntroPageModule,
        AngularMaterialModule
      ],
      providers: [provideAnimationsAsync()]
    });
  });

  it('should create the app module', () => {
    const module = TestBed.inject(AppModule);
    expect(module).toBeTruthy();
  });
});
