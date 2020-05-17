import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  event: Event = {
    eventid: '1',
    title: 'Picnic',
    description: 'You wanna go for a walk this weekend? Join us asap!!',
    memberlimit: 9,
    date: '12/03/2020',
    time: '12:00',
    location: 'Mountian',
    groupid: 'abc123',
    grouppicture: 9,
  };

  value = 'Look for what you want';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {}
}
