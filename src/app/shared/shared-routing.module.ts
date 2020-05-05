import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventCardComponent } from './event-card/event-card.component';

const routes: Routes = [
  {
    path: 'event-card',
    component: EventCardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
