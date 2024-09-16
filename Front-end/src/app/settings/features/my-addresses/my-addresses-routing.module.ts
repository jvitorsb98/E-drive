import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMyAddressesComponent } from './components/list-my-addresses/list-my-addresses.component';

const myAddressesRoutes: Routes = [
  { path: '', component: ListMyAddressesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(myAddressesRoutes)],
  exports: [RouterModule]
})
export class MyAddressesRoutingModule { }
