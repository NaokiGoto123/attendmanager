import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  value = 'Look for what you want';

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    console.log('before');
    this.eventService
      .getEvents(this.authService.uid)
      .pipe(
        map((groups: Event[]) =>
          tap((group: Event) => console.log(group.groupid))
        )
      );
    console.log('after');
  }
}
