import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event/create-event.component';


const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'create-event',
    loadChildren: () => import('./create-event/create-event.module').then(m => m.CreateEventModule)
  },
  {
    path: 'create-group',
    loadChildren: () => import ('./create-group/create-group.module').then(m => m.CreateGroupModule)
  },
  {
    path: 'events',
    loadChildren: () => import ('./events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'shared',
    loadChildren: () => import ('./shared/shared.module').then(m => m.SharedModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
