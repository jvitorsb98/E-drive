import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandListComponent } from './brand/components/brand-list/brand-list.component';
import { ModelListComponent } from './model/components/model-list/model-list.component';
import { VehicleListComponent } from './vehicle/components/vehicle-list/vehicle-list.component';
import { ReportGeneratorComponent } from './report-generator/report-generator.component';

const adminRoutes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'brands', component: BrandListComponent },
  { path: 'models', component: ModelListComponent},
  {path: 'reports', component: ReportGeneratorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
