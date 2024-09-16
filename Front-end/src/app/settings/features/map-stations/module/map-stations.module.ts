import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapStationsRoutingModule } from './map-stations-routing.module';
import { MapStationsComponent } from '../map-stations.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    MapStationsComponent,
  ],
  imports: [
    CommonModule,
    MapStationsRoutingModule,
    SharedModule
  ]
})
export class MapStationsModule { }
