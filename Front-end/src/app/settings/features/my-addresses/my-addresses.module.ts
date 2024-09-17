import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { MyAddressesRoutingModule } from './my-addresses-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { ListMyAddressesComponent } from './components/list-my-addresses/list-my-addresses.component';
import { ModalDetailsAddressComponent } from './components/modal-details-address/modal-details-address.component';
import { MyAddressesComponent } from './components/my-addresses/my-addresses.component';

@NgModule({
  declarations: [
    // Components
    ListMyAddressesComponent,
    ModalDetailsAddressComponent,
    MyAddressesComponent
  ],
  imports: [
    CommonModule,             // Modulo comum
    MyAddressesRoutingModule, // Modulo de rotas
    SharedModule,             // Modulo compartilhado
    AngularMaterialModule     // Modulo Angular Material
  ]
})
export class MyAddressesModule { }
