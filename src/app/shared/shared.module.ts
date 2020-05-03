import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { EventCardComponent } from './event-card/event-card.component';
import { SidenavComponent } from './sidenav/sidenav.component';


@NgModule({
  declarations: [EventCardComponent, SidenavComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
