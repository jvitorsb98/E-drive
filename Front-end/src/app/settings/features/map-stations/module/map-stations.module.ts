import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { MapStationsRoutingModule } from './map-stations-routing.module';

// Modules
import { SharedModule } from '../../../shared/shared.module';

// Components
import { MapStationsComponent } from '../map-stations.component';

@NgModule({
  declarations: [
    // MapStations component
    MapStationsComponent
  ],
  imports: [
    CommonModule,             // Modulo comum
    MapStationsRoutingModule, // Modulo de rotas
    SharedModule              // Modulo compartilhado
  ]
})
export class MapStationsModule { }
