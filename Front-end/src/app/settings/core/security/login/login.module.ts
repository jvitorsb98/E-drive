import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulo de roteamento específico para login
import { LoginRoutingModule } from './login-routing.module';

// Módulo de Angular Material
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';

// Módulo compartilhado com componentes, diretivas e pipes reutilizáveis
import { SharedModule } from '../../../shared/shared.module';

// Componentes específicos para o módulo de login
import { UserLoginComponent } from './user-login/user-login.component';
import { ModalRecoverPasswordComponent } from './recover-password/components/modal-recover-password/modal-recover-password.component';
import { ResetPasswordComponent } from './recover-password/components/reset-password/reset-password.component';
import { ConfirmAccountComponent } from './recover-password/components/confirm-account/confirm-account.component';

@NgModule({
  declarations: [
    // Declaração dos componentes que pertencem a este módulo
    UserLoginComponent,
    ModalRecoverPasswordComponent,
    ResetPasswordComponent,
    ConfirmAccountComponent
  ],
  imports: [
    // Módulos necessários para o funcionamento deste módulo
    CommonModule,                // Fornece diretivas comuns como ngIf e ngFor
    LoginRoutingModule,          // Configura as rotas específicas para login
    SharedModule,                // Fornece componentes, diretivas e pipes reutilizáveis
    AngularMaterialModule        // Fornece componentes do Angular Material
  ]
})
export class LoginModule { }
