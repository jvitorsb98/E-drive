import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapStationsComponent } from './components/map-stations/map-stations.component';
import { PlanningTripComponent } from './components/planning-trip/planning-trip.component';

const mapStationsRoutes: Routes = [
  { path: '', component: MapStationsComponent },
  { path: 'plan-trip', component: PlanningTripComponent }, // rota de planejar viagem
];

@NgModule({
  imports: [RouterModule.forChild(mapStationsRoutes)],
  exports: [RouterModule]
})
export class MapStationsRoutingModule { }
