import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAddressesRoutingModule } from './my-addresses-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListMyAddressesComponent } from './components/list-my-addresses/list-my-addresses.component';
import { ModalDetailsAddressComponent } from './components/modal-details-address/modal-details-address.component';
import { MyAddressesComponent } from './components/my-addresses/my-addresses.component';


@NgModule({
  declarations: [
    ListMyAddressesComponent,
    ModalDetailsAddressComponent,
    MyAddressesComponent
  ],
  imports: [
    CommonModule,
    MyAddressesRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class MyAddressesModule { }
