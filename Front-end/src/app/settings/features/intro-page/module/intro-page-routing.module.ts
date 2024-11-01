import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroPageComponent } from '../intro-page.component';
import { TravelTipsComponent } from '../../TravelTips/components/travel-tips/travel-tips.component';

const introPageRoutes: Routes = [
  { path: '', component: IntroPageComponent},
  { path: 'travel-tips', component: TravelTipsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(introPageRoutes)],
  exports: [RouterModule]
})
export class IntroPageRoutingModule { }
