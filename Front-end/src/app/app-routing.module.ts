import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroPageComponent } from './settings/features/intro-page/intro-page.component';
import { FooterComponent } from './settings/core/fragments/footer/footer.component';
import { UserRegistrationFormComponent } from './settings/features/users/components/user-registration-form/user-registration-form.component';
import { UserLoginModalComponent } from './settings/core/security/login/user-login-modal/user-login-modal.component';
import { UserVehicleComponent } from './settings/features/users/components/user-vehicle/user-vehicle.component';

const routes: Routes = [
  { path: 'intro-page', component: IntroPageComponent},
  { path: 'footer', component: FooterComponent },
  { path: 'login', component: UserLoginModalComponent},
  { path: 'user-registration', component: UserRegistrationFormComponent},
  { path: 'login', component: UserLoginModalComponent},
  { path: 'carros', component: UserVehicleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0,60],
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
