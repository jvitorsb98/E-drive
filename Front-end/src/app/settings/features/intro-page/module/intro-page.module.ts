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
import { TravelTipsComponent } from '../../TravelTips/components/travel-tips/travel-tips.component';

@NgModule({
  declarations: [
    // IntroPage component
    IntroPageComponent,
    TravelTipsComponent
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
