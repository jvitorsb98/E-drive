import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginModalComponent } from './user-login-modal/user-login-modal.component';
import { ResetPasswordComponent } from './recover-password/components/reset-password/reset-password.component';

const loginRoutes: Routes = [
  { path: '', component: UserLoginModalComponent },
  { path: 'reset-password', component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
