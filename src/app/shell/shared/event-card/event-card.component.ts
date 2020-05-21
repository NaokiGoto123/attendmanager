import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  attended = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  // ngOnInit(): void {
  //   if (this.authService.uid in this.event.attendingmembers) {
  //     this.attended = true;
  //   } else {
  //     this.attended = false;
  //   }
  // }

  switchStatus() {
    this.attended = !this.attended;
  }
}
