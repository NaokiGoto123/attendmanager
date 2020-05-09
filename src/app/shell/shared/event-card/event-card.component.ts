import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  attended = false;

  constructor() {}

  ngOnInit(): void {}

  switchStatus() {
    this.attended = !this.attended;
  }
}
