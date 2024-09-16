import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { UserPasswordModalComponent } from './components/user-password-modal/user-password-modal.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';


@NgModule({
  declarations: [
    UserRegistrationFormComponent,
    UserPasswordModalComponent,
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    AngularMaterialModule,
  ]
})
export class UsersModule { }
