import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { } 