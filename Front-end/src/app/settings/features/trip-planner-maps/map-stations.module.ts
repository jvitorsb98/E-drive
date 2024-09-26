import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { MapStationsRoutingModule } from './map-stations-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Components
import { MapStationsComponent } from './components/map-stations/map-stations.component';
import { ModalSetupTripComponent } from './components/modal-setup-trip/modal-setup-trip.component';
import { ModalFormVehicleBatteryComponent } from './components/modal-form-vehicle-battery/modal-form-vehicle-battery.component';

@NgModule({
  declarations: [
    // MapStations component
    MapStationsComponent,
    ModalSetupTripComponent,
    ModalFormVehicleBatteryComponent,
  ],
  imports: [
    CommonModule,             // Modulo comum
    MapStationsRoutingModule, // Modulo de rotas
    SharedModule              // Modulo compartilhado
  ]
})
export class MapStationsModule { }
