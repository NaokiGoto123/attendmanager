import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { GroupsComponent } from './groups/groups.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { AttendedEventsComponent } from './attended-events/attended-events.component';
import { SettingsComponent } from './settings/settings.component';
import { WaitingJoinningEventsComponent } from './waiting-joinning-events/waiting-joinning-events.component';
import { WaitingPayingEventsComponent } from './waiting-paying-events/waiting-paying-events.component';
import { WaitingJoinningGroupsComponent } from './waiting-joinning-groups/waiting-joinning-groups.component';
import { WaitingPayingGroupsComponent } from './waiting-paying-groups/waiting-paying-groups.component';
@NgModule({
  declarations: [
    AccountComponent,
    GroupsComponent,
    AttendingEventsComponent,
    AttendedEventsComponent,
    SettingsComponent,
    WaitingJoinningEventsComponent,
    WaitingPayingEventsComponent,
    WaitingJoinningGroupsComponent,
    WaitingPayingGroupsComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    SharedModule,
  ],
})
export class AccountModule {}
