import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatchedDetailsPageRoutingModule } from './catched-details-routing.module';

import { CatchedDetailsPage } from './catched-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatchedDetailsPageRoutingModule
  ],
  declarations: [CatchedDetailsPage]
})
export class CatchedDetailsPageModule {}
