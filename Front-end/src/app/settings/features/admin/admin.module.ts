import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { AdminRoutingModule } from './admin-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Vehicle Components
import { VehicleListComponent } from './vehicle/components/vehicle-list/vehicle-list.component';
import { ModalDetailsVehicleComponent } from './vehicle/components/modal-details-vehicle/modal-details-vehicle.component';
import { ModalFormVehicleComponent } from './vehicle/components/modal-form-vehicle/modal-form-vehicle.component';

// Model Components
import { ModelListComponent } from './model/components/model-list/model-list.component';
import { ModalDetailsModelComponent } from './model/components/modal-details-model/modal-details-model.component';
import { ModalFormModelComponent } from './model/components/modal-form-model/modal-form-model.component';

// Brand Components
import { BrandListComponent } from './brand/components/brand-list/brand-list.component';
import { ModalDetailsBrandComponent } from './brand/components/modal-details-brand/modal-details-brand.component';
import { ModalFormBrandComponent } from './brand/components/modal-form-brand/modal-form-brand.component';
import { ReportGeneratorComponent } from './report-generator/report-generator.component';

@NgModule({
  declarations: [
    // Brand Components
    BrandListComponent,
    ModalDetailsBrandComponent,
    ModalFormBrandComponent,

    // Model Components
    ModelListComponent,
    ModalDetailsModelComponent,
    ModalFormModelComponent,

    // Vehicle Components
    VehicleListComponent,
    ModalDetailsVehicleComponent,
    ModalFormVehicleComponent,

    // Report Generator
    ReportGeneratorComponent
  ],
  imports: [
    CommonModule,   
    AdminRoutingModule,    // Modulo de rotas
    SharedModule,          // Modulo compartilhado
    AngularMaterialModule // Módulo Angular Material
  ],
})
export class AdminModule { }
