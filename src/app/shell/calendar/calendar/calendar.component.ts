import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from 'src/app/services/event.service';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { Event } from 'src/app/interfaces/event';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin];

  eventNames$: string[];

  eventDates$: Date[];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.eventService
      .getEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        events.forEach((event) => {
          const result: string[] = [];
          result.push(event.title);
          console.log(result);
          this.eventNames$ = result;
        });
      });
    this.eventService
      .getEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        events.forEach((event) => {
          const result: Date[] = [];
          result.push(event.date.toDate());
          console.log(result);
          this.eventDates$ = result;
        });
      });
    console.log(this.eventNames$);
    console.log(this.eventDates$);
  }

  navigateBack() {
    this.location.back();
  }
}
