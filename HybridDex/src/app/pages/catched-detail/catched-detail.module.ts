import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatchedDetailPageRoutingModule } from './catched-detail-routing.module';

import { CatchedDetailPage } from './catched-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatchedDetailPageRoutingModule
  ],
  declarations: [CatchedDetailPage]
})
export class CatchedDetailPageModule {}
