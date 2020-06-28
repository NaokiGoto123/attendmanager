import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { EventCardComponent } from './event-card/event-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupComponent } from './group/group.component';
import { EventsAndDetailComponent } from './events-and-detail/events-and-detail.component';

@NgModule({
  declarations: [EventCardComponent, GroupComponent, EventsAndDetailComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  exports: [EventCardComponent, GroupComponent, EventsAndDetailComponent],
})
export class SharedModule {}
