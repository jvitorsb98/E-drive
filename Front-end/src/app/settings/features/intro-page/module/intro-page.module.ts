import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroPageRoutingModule } from './intro-page-routing.module';
import { IntroPageComponent } from '../intro-page.component';
import { FragmentsModule } from '../../../core/fragments/fragments.module';
import { SharedModule } from '../../../shared/shared.module';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';


@NgModule({
  declarations: [
    IntroPageComponent
  ],
  imports: [
    CommonModule,
    IntroPageRoutingModule,
    FragmentsModule,
    SharedModule,
    AngularMaterialModule,
  ],
  exports: [IntroPageComponent]
})
export class IntroPageModule { }
