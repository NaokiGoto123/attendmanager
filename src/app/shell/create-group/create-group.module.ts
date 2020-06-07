import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateGroupRoutingModule } from './create-group-routing.module';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [CreateGroupComponent],
  imports: [
    CommonModule,
    CreateGroupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SwiperModule,
    MatSlideToggleModule,
  ],
})
export class CreateGroupModule {}
