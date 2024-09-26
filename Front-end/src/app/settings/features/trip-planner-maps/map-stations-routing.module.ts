import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapStationsComponent } from './components/map-stations/map-stations.component';

const mapStationsRoutes: Routes = [
  { path: '', component: MapStationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(mapStationsRoutes)],
  exports: [RouterModule]
})
export class MapStationsRoutingModule { }
