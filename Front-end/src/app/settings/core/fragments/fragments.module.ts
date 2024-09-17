import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulo de roteamento específico para fragmentos
import { FragmentsRoutingModule } from './fragments-routing.module';

// Módulo de Angular Material
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Componentes específicos
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { FaqPopupComponent } from './faq-popup/faq-popup.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarIntroComponent } from './navbar-intro/navbar-intro.component';

@NgModule({
  declarations: [
    // Declaração dos componentes que pertencem a este módulo
    BottomBarComponent,
    FaqPopupComponent,
    FooterComponent,
    NavbarIntroComponent
  ],
  imports: [
    // Módulos necessários para o funcionamento deste módulo
    CommonModule,                // Fornece diretivas comuns como ngIf e ngFor
    FragmentsRoutingModule,      // Configura as rotas para este módulo
    AngularMaterialModule        // Fornece componentes do Angular Material
  ],
  exports: [
    // Componentes que serão reutilizáveis em outros módulos
    BottomBarComponent,
    FaqPopupComponent,
    FooterComponent,
    NavbarIntroComponent
  ]
})
export class FragmentsModule { }
