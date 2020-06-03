import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, CalendarRoutingModule, FullCalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarModule {}
