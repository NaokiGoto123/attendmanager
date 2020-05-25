import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateEventGuard } from 'src/app/guards/createevent.guard';

const routes: Routes = [
  {
    path: '',
    component: CreateEventComponent,
    canDeactivate: [CreateEventGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEventRoutingModule {}
