import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './settings/angular-material/angular-material.module';
import { UserRegistrationFormComponent } from './settings/features/users/components/user-registration-form/user-registration-form.component';
import { UserPasswordModalComponent } from './settings/features/users/components/user-password-modal/user-password-modal.component';

// Diretivas
import { EmailPatternValidatorDirective } from './settings/shared/directives/email-pattern-validator.directive';

// Pipes
import { PhoneMaskPipe } from './settings/shared/pipes/phone-mask.pipe';
import { IntroPageComponent } from './settings/features/intro-page/intro-page.component';
import { FooterComponent } from './settings/core/fragments/footer/footer.component';
import { NavbarIntroComponent } from './settings/core/fragments/header/navbar-intro/navbar-intro.component';
import { UserLoginModalComponent } from './settings/features/users/components/user-login-modal/user-login-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserPasswordModalComponent,

    // Diretivas
    EmailPatternValidatorDirective,

    // Pipes
    PhoneMaskPipe,
      IntroPageComponent,
      FooterComponent,
      NavbarIntroComponent,
      UserLoginModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
