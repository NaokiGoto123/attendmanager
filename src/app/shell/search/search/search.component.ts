import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  value = 'Look for what you want';

  event: Event = {
    eventid: '1',
    title: 'Picnic',
    desription: 'You wanna go for a walk this weekend? Join us asap!!',
    limit: 9,
    date: '12/03/2020',
    time: '12:00',
    location: 'Mountian',
    groupid: 'abc123',
    grouppicture: '/assets/images/example.jpg',
  };

  constructor() {}

  ngOnInit(): void {}
}
