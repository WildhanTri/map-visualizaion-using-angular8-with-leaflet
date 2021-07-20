import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const appsRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@app/pages/home/home.module').then(m => m.HomeModule)
  },
  // {
  //   path: 'database',
  //   loadChildren: () => import('@app/content/operator/operator.module').then(m => m.OperatorModule)
  // },
  // {
  //   path: 'settings',
  //   loadChildren: () => import('@app/content/mogawers/mogawers.module').then(m => m.MogawersModule)
  // }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appsRoutes),
    CommonModule
  ]
})
export class PagesModule { }
