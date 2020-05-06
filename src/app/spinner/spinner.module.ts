import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerRoutingModule } from './spinner-routing.module';
import { SpinnerComponent } from './spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    SpinnerRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class SpinnerModule { }
