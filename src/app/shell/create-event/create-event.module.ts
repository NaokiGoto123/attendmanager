import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEventRoutingModule } from './create-event-routing.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [CreateEventComponent],
  imports: [
    CommonModule,
    CreateEventRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    NgxMaterialTimepickerModule,
    MatRadioModule,
  ],
})
export class CreateEventModule {}
