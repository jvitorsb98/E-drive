import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroPageComponent } from '../intro-page.component';

const introPageRoutes: Routes = [
  { path: 'intro-page', component: IntroPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(introPageRoutes)],
  exports: [RouterModule]
})
export class IntroPageRoutingModule { }
