import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalDetailsBrandComponent } from './components/modal-details-brand/modal-details-brand.component';
import { ModalFormBrandComponent } from './components/modal-form-brand/modal-form-brand.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BrandListComponent } from './components/brand-list/brand-list.component';


@NgModule({
  declarations: [
    BrandListComponent,
    ModalDetailsBrandComponent,
    ModalFormBrandComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class BrandModule { }
