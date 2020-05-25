import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateGroupGuard } from 'src/app/guards/creategroup.guard';

const routes: Routes = [
  {
    path: '',
    component: CreateGroupComponent,
    canDeactivate: [CreateGroupGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateGroupRoutingModule {}
