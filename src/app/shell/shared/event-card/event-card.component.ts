import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  attended = false;

  eventid: string;

  grouppicture: Observable<number>;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    public eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventid = this.event.eventid;

    this.grouppicture = this.groupService.getGrouppicture(this.event.groupid);

    if (this.event.attendingmembers.includes(this.authService.uid)) {
      this.attended = true;
    } else {
      this.attended = false;
    }
  }

  attendEvent() {
    this.switchStatus();
    this.eventService.attendEvent(this.authService.uid, this.eventid);
  }

  leaveEvent() {
    this.switchStatus();
    this.eventService.leaveEvent(this.authService.uid, this.eventid);
  }

  switchStatus() {
    this.attended = !this.attended;
  }
}
