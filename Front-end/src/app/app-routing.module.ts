import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroPageComponent } from './settings/features/intro-page/intro-page.component';
import { authGuard } from './settings/core/security/guards/auth.guard';
import { canMatchGuard } from './settings/core/security/guards/can-match.guard';


const routes: Routes = [

  {
    path: 'intro-page', component: IntroPageComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./settings/core/security/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'e-driver/users',
    children: [
      {
        path: 'registration',
        loadChildren: () => import('./settings/features/users/users.module').then(m => m.UsersModule),
      },
    ]
  },
  {
    path: 'e-driver',
    canActivate: [authGuard],
    canMatch: [canMatchGuard],
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () => import('./settings/features/users/users.module').then(m => m.UsersModule),
          },
          {
            path: 'myinfo',
            loadChildren: () => import('./settings/features/users/users.module').then(m => m.UsersModule),
          },
          {
            path: 'reset-password',
            loadChildren: () => import('./settings/features/users/users.module').then(m => m.UsersModule)
          },
          {
            path: 'my-vehicles',
            loadChildren: () => import('./settings/features/user-vehicle/user-vehicle.module').then(m => m.UserVehicleModule),
          },
          {
            path: 'my-addresses',
            loadChildren: () => import('./settings/features/my-addresses/my-addresses.module').then(m => m.MyAddressesModule),
          },
          // Adicionar outras rotas para 'users' aqui
        ]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./settings/features/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'map',
        loadChildren: () => import('./settings/features/map-stations/module/map-stations.module').then(m => m.MapStationsModule),
      },
    ]
  },
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