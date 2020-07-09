import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-events-list-view',
  templateUrl: './events-list-view.component.html',
  styleUrls: ['./events-list-view.component.scss'],
})
export class EventsListViewComponent implements OnInit {
  @Input() events: Event[];

  @Input() existence: boolean;

  constructor() {}

  ngOnInit(): void {}
}
