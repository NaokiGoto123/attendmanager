import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupDetailsRoutingModule } from './group-details-routing.module';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [GroupDetailsComponent],
  imports: [
    CommonModule,
    GroupDetailsRoutingModule,
    SharedModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
})
export class GroupDetailsModule {}
