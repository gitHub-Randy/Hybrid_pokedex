import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatchedDetailPage } from './catched-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CatchedDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatchedDetailPageRoutingModule {}
