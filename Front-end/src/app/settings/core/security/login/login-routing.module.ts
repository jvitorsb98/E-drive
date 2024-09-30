import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginModalComponent } from './user-login-modal/user-login-modal.component';
import { ResetPasswordComponent } from './recover-password/components/reset-password/reset-password.component';
import { ConfirmAccountComponent } from './recover-password/components/confirm-account/confirm-account.component';

const loginRoutes: Routes = [
  { path: '', component: UserLoginModalComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'recover-account', component: ConfirmAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
