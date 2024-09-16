import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginModalComponent } from './user-login-modal/user-login-modal.component';

const loginRoutes: Routes = [
  { path: '', component: UserLoginModalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
