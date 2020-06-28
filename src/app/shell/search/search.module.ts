import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { EventsComponent } from './events/events.component';
import { GroupsComponent } from './groups/groups.component';
import { AccountsComponent } from './accounts/accounts.component';

@NgModule({
  declarations: [
    SearchComponent,
    EventsComponent,
    GroupsComponent,
    AccountsComponent,
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    SharedModule,
    MatTabsModule,
  ],
})
export class SearchModule {}
