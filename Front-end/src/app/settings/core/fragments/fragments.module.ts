import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FragmentsRoutingModule } from './fragments-routing.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { FaqPopupComponent } from './faq-popup/faq-popup.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarIntroComponent } from './navbar-intro/navbar-intro.component';


@NgModule({
  declarations: [
    BottomBarComponent,
    FaqPopupComponent,
    FooterComponent,
    NavbarIntroComponent,
  ],
  imports: [
    CommonModule,
    FragmentsRoutingModule,
    AngularMaterialModule,
  ],
  exports: [
    BottomBarComponent,
    FaqPopupComponent,
    FooterComponent,
    NavbarIntroComponent, // Exporte todos os componentes que você deseja reutilizar
  ]
})
export class FragmentsModule { }
