import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  searchableEvents: Event[];

  ifSearchableEvents: boolean;

  constructor(private eventService: EventService) {
    this.eventService
      .getSearchableEvents()
      .subscribe((searchableEvents: Event[]) => {
        if (searchableEvents.length) {
          this.ifSearchableEvents = true;
          this.searchableEvents = searchableEvents;
        } else {
          this.ifSearchableEvents = false;
        }
      });
  }

  ngOnInit(): void {}
}
