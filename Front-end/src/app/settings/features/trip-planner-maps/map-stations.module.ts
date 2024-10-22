import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { MapStationsRoutingModule } from './map-stations-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { MapStationsComponent } from './components/map-stations/map-stations.component';
import { ModalFormVehicleBatteryComponent } from './components/modal-form-vehicle-battery/modal-form-vehicle-battery.component';
import { ModalSelectAddressComponent } from './components/modal-select-address/modal-select-address.component';
import { PlanningTripComponent } from './components/planning-trip/planning-trip.component';

@NgModule({
  declarations: [
    // MapStations component
    MapStationsComponent,
    ModalFormVehicleBatteryComponent,
    ModalSelectAddressComponent,
    PlanningTripComponent,
  ],
  imports: [
    CommonModule,             // Modulo comum
    MapStationsRoutingModule, // Modulo de rotas
    SharedModule,              // Modulo compartilhado
    AngularMaterialModule     // Modulo Angular Material
  ]
})
export class MapStationsModule { }
