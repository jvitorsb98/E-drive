import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing Module
import { VehiclesRoutingModule } from './vehicles-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';

@NgModule({
  declarations: [
    // Vehicle components
    VehicleListComponent
  ],
  imports: [
    CommonModule,          // Módulo comum
    VehiclesRoutingModule, // Módulo de rotas
    SharedModule,          // Módulo compartilhado
    AngularMaterialModule  // Módulo Angular Material
  ]
})
export class VehiclesModule { }
