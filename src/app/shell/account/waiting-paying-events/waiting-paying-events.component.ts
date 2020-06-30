import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-waiting-paying-events',
  templateUrl: './waiting-paying-events.component.html',
  styleUrls: ['./waiting-paying-events.component.scss'],
})
export class WaitingPayingEventsComponent implements OnInit {
  waitingPayingEvents: Event[];

  waitingPayingEventsExistance: boolean;

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
            .getWaitingPayingEvents(id)
            .subscribe((waitingPayingEvents: Event[]) => {
              if (waitingPayingEvents.length) {
                this.waitingPayingEvents = waitingPayingEvents;
                this.waitingPayingEventsExistance = true;
              } else {
                this.waitingPayingEvents = waitingPayingEvents;
                this.waitingPayingEventsExistance = false;
              }
            });
        });
    });
  }

  ngOnInit(): void {}
}