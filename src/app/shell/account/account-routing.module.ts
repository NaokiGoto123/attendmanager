import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { GroupsComponent } from './groups/groups.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { AttendedEventsComponent } from './attended-events/attended-events.component';
import { SettingsComponent } from './settings/settings.component';
import { WaitingJoinningGroupsComponent } from './waiting-joinning-groups/waiting-joinning-groups.component';
import { WaitingPayingGroupsComponent } from './waiting-paying-groups/waiting-paying-groups.component';
import { WaitingJoinningEventsComponent } from './waiting-joinning-events/waiting-joinning-events.component';
import { WaitingPayingEventsComponent } from './waiting-paying-events/waiting-paying-events.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'groups',
        component: GroupsComponent,
      },
      {
        path: 'attending-events',
        component: AttendingEventsComponent,
      },
      {
        path: 'attended-events',
        component: AttendedEventsComponent,
      },
      {
        path: 'waiting-groups',
        component: WaitingJoinningGroupsComponent,
      },
      {
        path: 'paying-groups',
        component: WaitingPayingGroupsComponent,
      },
      {
        path: 'waiting-events',
        component: WaitingJoinningEventsComponent,
      },
      {
        path: 'paying-events',
        component: WaitingPayingEventsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
