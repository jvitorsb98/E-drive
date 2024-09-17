import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserVehicleListComponent } from './components/user-vehicle-list/user-vehicle-list.component';

const userVehicleRoutes: Routes = [
  { path: '', component: UserVehicleListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(userVehicleRoutes)],
  exports: [RouterModule]
})
export class UserVehicleRoutingModule { }
