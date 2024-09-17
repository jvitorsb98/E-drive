import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { UserVehicleRoutingModule } from './user-vehicle-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { UserVehicleListComponent } from './components/user-vehicle-list/user-vehicle-list.component';
import { ModalDetailsVehicleComponent } from './components/modal-details-vehicle/modal-details-vehicle.component';
import { ModalFormVehicleComponent } from './components/modal-form-vehicle/modal-form-vehicle.component';

@NgModule({
  declarations: [
    // Components
    UserVehicleListComponent,
    ModalDetailsVehicleComponent,
    ModalFormVehicleComponent
  ],
  imports: [
    CommonModule,             // Modulo comum
    UserVehicleRoutingModule, // Modulo de rotas
    SharedModule,             // Modulo compartilhado
    AngularMaterialModule     // Modulo Angular Material
  ]
})
export class UserVehicleModule { }
