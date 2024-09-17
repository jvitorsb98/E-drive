import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { IntroPageRoutingModule } from './intro-page-routing.module';

// Components
import { IntroPageComponent } from '../intro-page.component';

// Modules
import { FragmentsModule } from '../../../core/fragments/fragments.module';
import { SharedModule } from '../../../shared/shared.module';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';

@NgModule({
  declarations: [
    // IntroPage component
    IntroPageComponent
  ],
  imports: [
    CommonModule,           // Modulo comum
    IntroPageRoutingModule, // Modulo de rotas
    FragmentsModule,        // Modulo compartilhado
    SharedModule,           // Modulo compartilhado
    AngularMaterialModule   // Modulo Angular Material
  ],
  exports: [
    IntroPageComponent
  ]
})
export class IntroPageModule { }
