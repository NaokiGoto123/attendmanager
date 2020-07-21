import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { EventsComponent } from './events/events.component';
import { GroupsComponent } from './groups/groups.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'events',
      },
      {
        path: 'events',
        component: EventsComponent,
      },
      {
        path: 'groups',
        component: GroupsComponent,
      },
      {
        path: 'accounts',
        component: AccountsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
