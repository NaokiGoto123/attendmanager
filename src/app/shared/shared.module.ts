import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { EventCardComponent } from './event-card/event-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';




@NgModule({
  declarations: [EventCardComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  exports: [
    EventCardComponent,
  ]
})
export class SharedModule { }
