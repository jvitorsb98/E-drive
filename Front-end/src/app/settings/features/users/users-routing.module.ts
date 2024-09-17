import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationFormComponent } from './components/user-registration-form/user-registration-form.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { UserPasswordModalComponent } from './components/user-password-modal/user-password-modal.component';

const userRegistrationsRoutes: Routes = [
  { path: '', component: UserRegistrationFormComponent },
  { path: 'registration', component: UserRegistrationFormComponent },
  { path: 'myinfo', component: UserUpdateComponent },
  { path: 'reset-password', component: UserPasswordModalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(userRegistrationsRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
