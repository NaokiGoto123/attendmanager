import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'events',
        loadChildren: () =>
          import('./events/events.module').then((m) => m.EventsModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'create-event',
        loadChildren: () =>
          import('./create-event/create-event.module').then(
            (m) => m.CreateEventModule
          ),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('./groups/groups.module').then((m) => m.GroupsModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'groups/create-group',
        loadChildren: () =>
          import('./create-group/create-group.module').then(
            (m) => m.CreateGroupModule
          ),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'shared',
        loadChildren: () =>
          import('./shared/shared.module').then((m) => m.SharedModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
