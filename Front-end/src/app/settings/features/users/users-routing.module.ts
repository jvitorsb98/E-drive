import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { UserPasswordModalComponent } from './components/user-password-modal/user-password-modal.component';
import { UserPerfilComponent } from './components/user-perfil/user-perfil.component';

const userRegistrationsRoutes: Routes = [
  { path: '', component: UserRegistrationFormComponent },
  { path: 'registration', component: UserRegistrationFormComponent },
  { path: 'myinfo', component: UserPerfilComponent },
  { path: 'reset-password', component: UserPasswordModalComponent},
  { path: 'update', component: UserUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(userRegistrationsRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
