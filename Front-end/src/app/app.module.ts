// Angular Modulos
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './settings/angular-material/angular-material.module';

// Providers
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Componentes
import { AppComponent } from './app.component';
import { UserRegistrationFormComponent } from './settings/features/users/components/user-registration-form/user-registration-form.component';
import { UserPasswordModalComponent } from './settings/features/users/components/user-password-modal/user-password-modal.component';
import { IntroPageComponent } from './settings/features/intro-page/intro-page.component';
import { FooterComponent } from './settings/core/fragments/footer/footer.component';
import { NavbarIntroComponent } from './settings/core/fragments/header/navbar-intro/navbar-intro.component';
import { UserLoginModalComponent } from './settings/core/security/login/user-login-modal/user-login-modal.component';
import { ResetPasswordComponent } from './settings/core/security/login/recover-password/reset-password/reset-password.component';
import { VehicleListComponent } from './settings/features/vehicles/components/vehicle-list/vehicle-list.component';
import { UserVehicleComponent } from './settings/features/users/components/user-vehicle/user-vehicle.component';
import { ModalViewVehicleComponent } from './settings/features/users/components/user-vehicle/modal-view-vehicle/modal-view-vehicle.component';
import { ModalFormVehicleComponent } from './settings/features/users/components/user-vehicle/modal-form-vehicle/modal-form-vehicle.component';
import { MapStationsComponent } from './settings/features/map-stations/map-stations.component';
import { UserUpdateComponent } from './settings/features/users/components/user-update/user-update.component';
import { DeshboardComponent } from './settings/features/home/components/deshboard/deshboard.component';
import { NavbarComponent } from './settings/features/home/components/navbar/navbar.component';
import { UiButtonComponent } from './settings/shared/components/ui-button/ui-button.component';

// Diretivas
import { EmailPatternValidatorDirective } from './settings/shared/directives/email-pattern-validator.directive';
import { DynamicMaskDirective } from './settings/shared/directives/dynamic-mask.directive';

// Pipes
import { PhoneMaskPipe } from './settings/shared/pipes/phone-mask.pipe';
import { CommonModule } from '@angular/common';
import { MyAddressesComponent } from './settings/features/my-addresses/components/my-addresses/my-addresses.component';
import { FaqPopupComponent } from './settings/core/fragments/FAQ/faq-popup/faq-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserPasswordModalComponent,
    IntroPageComponent,
    FooterComponent,
    NavbarIntroComponent,
    UserLoginModalComponent,
    ResetPasswordComponent,
    VehicleListComponent,
    UserVehicleComponent,
    ModalViewVehicleComponent,
    ModalFormVehicleComponent,
    MapStationsComponent,
    UserUpdateComponent,
    NavbarComponent,
    DeshboardComponent,
    UiButtonComponent,

    // Diretivas
    EmailPatternValidatorDirective,
    DynamicMaskDirective,

    // Pipes
    PhoneMaskPipe,
      MyAddressesComponent,
      FaqPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    CommonModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }