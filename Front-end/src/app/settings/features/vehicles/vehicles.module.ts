import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';


@NgModule({
  declarations: [
    VehicleListComponent,
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class VehiclesModule { }
