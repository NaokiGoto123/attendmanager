import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-waiting-joinning-events',
  templateUrl: './waiting-joinning-events.component.html',
  styleUrls: ['./waiting-joinning-events.component.scss'],
})
export class WaitingJoinningEventsComponent implements OnInit {
  waitingJoinningEvents: Event[];

  waitingJoinningEventsExistance: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.eventService
        .getWaitingJoinningEvents(id)
        .subscribe((waitingJoinningEvents: Event[]) => {
          if (waitingJoinningEvents.length) {
            this.waitingJoinningEvents = waitingJoinningEvents;
            this.waitingJoinningEventsExistance = true;
          } else {
            this.waitingJoinningEvents = waitingJoinningEvents;
            this.waitingJoinningEventsExistance = false;
          }
        });
    });
  }

  ngOnInit(): void {}
}
