import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './settings/angular-material/angular-material.module';
import { UserRegistrationFormComponent } from './settings/features/users/components/user-registration-form/user-registration-form.component';
import { UserPasswordModalComponent } from './settings/features/users/components/user-password-modal/user-password-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserPasswordModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
