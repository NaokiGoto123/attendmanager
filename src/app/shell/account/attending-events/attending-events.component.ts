import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-attending-events',
  templateUrl: './attending-events.component.html',
  styleUrls: ['./attending-events.component.scss'],
})
export class AttendingEventsComponent implements OnInit {
  attendingEvents: Event[];

  ifAttendingEvents: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.authService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.eventService
            .getAttendingEvents(id)
            .subscribe((attendingEvents: Event[]) => {
              if (attendingEvents.length) {
                const now = new Date();
                const events: Event[] = [];
                attendingEvents.forEach((attendingEvent: Event) => {
                  if (attendingEvent.date.toDate() > now) {
                    events.push(attendingEvent);
                  }
                });
                if (events.length) {
                  this.ifAttendingEvents = true;
                  this.attendingEvents = events;
                } else {
                  this.ifAttendingEvents = false;
                }
              } else {
                this.ifAttendingEvents = false;
              }
            });
        });
    });
  }

  ngOnInit(): void {}
}
