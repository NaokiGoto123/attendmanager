import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateGroupRoutingModule } from './create-group-routing.module';
import { CreateGroupComponent } from './create-group/create-group.component';


@NgModule({
  declarations: [CreateGroupComponent],
  imports: [
    CommonModule,
    CreateGroupRoutingModule
  ]
})
export class CreateGroupModule { }
