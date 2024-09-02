import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroPageComponent } from './settings/features/intro-page/intro-page.component';
import { UserRegistrationFormComponent } from './settings/features/users/components/user-registration-form/user-registration-form.component';
import { UserLoginModalComponent } from './settings/core/security/login/user-login-modal/user-login-modal.component';
import { DashboardComponent } from './settings/features/home/components/dashboard/dashboard.component';
import { UserVehicleListComponent } from './settings/features/user-vehicle/components/user-vehicle-list/user-vehicle-list.component';
import { UserPasswordModalComponent } from './settings/features/users/components/user-password-modal/user-password-modal.component';
import { UserUpdateComponent } from './settings/features/users/components/user-update/user-update.component';
import { ListMyAddressesComponent } from './settings/features/my-addresses/components/list-my-addresses/list-my-addresses.component';
import { MyAddressesComponent } from './settings/features/my-addresses/components/my-addresses/my-addresses.component';
import { BrandViewComponent } from './settings/features/brand/components/brand-view/brand-view.component';

const routes: Routes = [
  { path: 'intro-page', component: IntroPageComponent},
  { path:'deshboard', component: DashboardComponent},
  { path: 'login', component: UserLoginModalComponent},
  { path: 'user-registration', component: UserRegistrationFormComponent},
  { path: 'meus-carros', component: UserVehicleListComponent},
  { path: 'meus-Dados', component: UserUpdateComponent},
  { path: 'meus-enderecos', component: ListMyAddressesComponent },
  { path: 'new-address', component: MyAddressesComponent },
  { path: 'my-addresses/edit', component: MyAddressesComponent },
  { path: 'reset-password', component: UserPasswordModalComponent },
  { path: 'admin', component: BrandViewComponent },
  { path: '', redirectTo: '/intro-page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 60],
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
