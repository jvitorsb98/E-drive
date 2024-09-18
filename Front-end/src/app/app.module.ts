// Angular Módulos
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Rotas e Módulos de Funcionalidades
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './settings/angular-material/angular-material.module';
import { SharedModule } from './settings/shared/shared.module';
import { VehiclesModule } from './settings/features/vehicles/vehicles.module';
import { FragmentsModule } from './settings/core/fragments/fragments.module';
import { IntroPageModule } from './settings/features/intro-page/module/intro-page.module';

// Providers
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Componentes Principais
import { AppComponent } from './app.component';
import { AdminModule } from './settings/features/admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, // Rotas principais da aplicação

    // Módulos de funcionalidades
    SharedModule,
    VehiclesModule,
    FragmentsModule,
    IntroPageModule,
    AdminModule,

    // Módulo do Angular Material
    AngularMaterialModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

