import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { UserLoginModalComponent } from './user-login-modal/user-login-modal.component';
import { ResetPasswordComponent } from './recover-password/reset-password/reset-password.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    UserLoginModalComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class LoginModule { }
