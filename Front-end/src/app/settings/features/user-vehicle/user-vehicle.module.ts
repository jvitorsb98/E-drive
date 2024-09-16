import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserVehicleRoutingModule } from './user-vehicle-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { UserVehicleListComponent } from './components/user-vehicle-list/user-vehicle-list.component';
import { ModalDetailsVehicleComponent } from './components/modal-details-vehicle/modal-details-vehicle.component';
import { ModalFormVehicleComponent } from './components/modal-form-vehicle/modal-form-vehicle.component';


@NgModule({
  declarations: [
    UserVehicleListComponent,
    ModalDetailsVehicleComponent,
    ModalFormVehicleComponent
  ],
  imports: [
    CommonModule,
    UserVehicleRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class UserVehicleModule { }
