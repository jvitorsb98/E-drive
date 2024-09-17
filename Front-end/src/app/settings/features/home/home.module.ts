import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { HomeRoutingModule } from './home-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    // Dashboard Component
    DashboardComponent,

    // Navbar Component
    NavbarComponent
  ],
  imports: [
    CommonModule,           // Modulo comum
    HomeRoutingModule,      // Modulo de rotas
    SharedModule,           // Modulo compartilhado
    AngularMaterialModule   // Módulo Angular Material
  ]
})
export class HomeModule { }
