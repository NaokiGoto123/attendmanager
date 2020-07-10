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
import { EventsListViewComponent } from './events-list-view/events-list-view.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    EventCardComponent,
    GroupComponent,
    EventsAndDetailComponent,
    EventsListViewComponent,
    EventDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
  ],
  exports: [
    EventCardComponent,
    GroupComponent,
    EventsAndDetailComponent,
    EventsListViewComponent,
    EventDialogComponent,
  ],
})
export class SharedModule {}
