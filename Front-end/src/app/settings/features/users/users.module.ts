import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { UsersRoutingModule } from './users-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

// Components
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { UserPasswordModalComponent } from './components/user-password-modal/user-password-modal.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { UserPerfilComponent } from './components/user-perfil/user-perfil.component';

@NgModule({
  declarations: [
    // Components
    UserRegistrationFormComponent,
    UserPasswordModalComponent,
    UserUpdateComponent,
    UserPerfilComponent
  ],
  imports: [
    CommonModule,         // Modulo comum
    UsersRoutingModule,   // Modulo de rotas
    SharedModule,         // Modulo compartilhado
    AngularMaterialModule // Modulo Angular Material
  ]
})
export class UsersModule { }
