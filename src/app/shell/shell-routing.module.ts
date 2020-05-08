import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'create-event',
        pathMatch: 'full',
        loadChildren: () =>
          import('./create-event/create-event.module').then(
            (m) => m.CreateEventModule
          ),
      },
      {
        path: 'groups/create-group',
        pathMatch: 'full',
        loadChildren: () =>
          import('./create-group/create-group.module').then(
            (m) => m.CreateGroupModule
          ),
      },
      {
        path: 'events',
        pathMatch: 'full',
        loadChildren: () =>
          import('./events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'shared',
        pathMatch: 'full',
        loadChildren: () =>
          import('./shared/shared.module').then((m) => m.SharedModule),
      },
      {
        path: 'search',
        pathMatch: 'full',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'settings',
        pathMatch: 'full',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'account',
        pathMatch: 'full',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'groups',
        pathMatch: 'full',
        loadChildren: () =>
          import('./groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: 'notifications',
        pathMatch: 'full',
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
