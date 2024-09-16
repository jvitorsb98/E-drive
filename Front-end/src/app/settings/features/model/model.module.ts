import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ModalDetailsModelComponent } from './components/modal-details-model/modal-details-model.component';
import { ModalFormModelComponent } from './components/modal-form-model/modal-form-model.component';


@NgModule({
  declarations: [
    ModelListComponent,
    ModalDetailsModelComponent,
    ModalFormModelComponent
  ],
  imports: [
    CommonModule,
    ModelRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class ModelModule { }
