import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  value = 'Look for what you want';

  nodata: boolean;

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.events === null) {
      this.nodata = true;
    } else {
      this.nodata = false;
    }
    console.log(this.nodata);
  }
}
