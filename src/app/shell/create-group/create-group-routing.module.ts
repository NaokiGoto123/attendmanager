import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormGuard } from 'src/app/guards/form.guard';

const routes: Routes = [
  {
    path: '',
    component: CreateGroupComponent,
    canDeactivate: [FormGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateGroupRoutingModule {}
