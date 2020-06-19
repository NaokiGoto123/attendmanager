import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { GroupsComponent } from './groups/groups.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { AttendedEventsComponent } from './attended-events/attended-events.component';
import { SettingsComponent } from './settings/settings.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
