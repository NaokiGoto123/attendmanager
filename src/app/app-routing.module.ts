import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event/create-event.component';
import { NotfoundComponent } from './notfound/notfound.component';


const routes: Routes = [
  {
    path: 'welcome',
    pathMatch: 'full',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'create-event',
    pathMatch: 'full',
    loadChildren: () => import('./create-event/create-event.module').then(m => m.CreateEventModule)
  },
  {
    path: 'groups/create-group',
    pathMatch: 'full',
    loadChildren: () => import ('./create-group/create-group.module').then(m => m.CreateGroupModule)
  },
  {
    path: 'events',
    pathMatch: 'full',
    loadChildren: () => import ('./events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'shared',
    pathMatch: 'full',
    loadChildren: () => import ('./shared/shared.module').then(m => m.SharedModule)
  },
  {
    path: 'search',
    pathMatch: 'full',
    loadChildren: () => import ('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'settings',
    pathMatch: 'full',
    loadChildren: () => import ('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'account',
    pathMatch: 'full',
    loadChildren: () => import ('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'groups',
    pathMatch: 'full',
    loadChildren: () => import ('./groups/groups.module').then(m => m.GroupsModule)
  },
  {
    path: 'spinner',
    pathMatch: 'full',
    loadChildren: () => import ('./spinner/spinner.module').then(m => m.SpinnerModule)
  },
  {
    path: 'notifications',
    pathMatch: 'full',
    loadChildren: () => import ('./notifications/notifications.module').then(m => m.NotificationsModule)
  },
  {
    path: '**', // this path should be the last.
    pathMatch: 'full',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
