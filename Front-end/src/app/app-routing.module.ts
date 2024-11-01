import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './settings/core/security/guards/auth.guard';
import { canMatchGuard } from './settings/core/security/guards/can-match.guard';

const routes: Routes = [
  {
    path: 'e-driver',
    children: [
      {
        path: 'intro-page',
        loadChildren: () => import('./settings/features/intro-page/module/intro-page.module').then(m => m.IntroPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./settings/core/security/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'users/registration',
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
        loadChildren: () => import('./settings/features/trip-planner-maps/map-stations.module').then(m => m.MapStationsModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('./settings/features/admin/admin.module').then(m => m.AdminModule)
      },
    ]
  },
  { path: '', redirectTo: 'e-driver/intro-page', pathMatch: 'full' },
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
