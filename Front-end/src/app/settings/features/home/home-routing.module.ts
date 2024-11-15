import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TravelTipsComponent } from '../TravelTips/components/travel-tips/travel-tips.component';

const dashboardRoutes: Routes = [
  {path: '', component: DashboardComponent},
  { path: 'travel-tips', component: TravelTipsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
