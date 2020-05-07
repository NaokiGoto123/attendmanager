import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  title = 'Picnic';
  creater = 'John Marqury';
  description =
    'Description: We will go for a walk this weekend. Attend or text in the chat if interested.';

  constructor() {}

  ngOnInit(): void {}
}
