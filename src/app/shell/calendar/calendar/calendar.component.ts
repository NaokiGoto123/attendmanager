import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/interfaces/event';
import { Location } from '@angular/common';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin];

  eventsWithNameAndDate: { title: string; date: Date }[];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.eventService
      .getMyEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        const result: { title: string; date: Date }[] = [];
        events.forEach((event) => {
          result.push({ title: event.title, date: event.date.toDate() });
        });
        this.eventsWithNameAndDate = result;
      });
  }

  navigateBack() {
    this.location.back();
  }
}
