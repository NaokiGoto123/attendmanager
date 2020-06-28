import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  value = '';

  groups: Group[];
  groupExistance: boolean;

  events: Event[];
  eventsExistance: boolean;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService
  ) {
    this.eventService
      .getMyEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        this.events = events;
        if (events.length) {
          this.eventsExistance = true;
        } else {
          this.eventsExistance = false;
        }
      });
    this.groupService
      .getMyGroup(this.authService.uid)
      .subscribe((groups: Group[]) => {
        this.groups = groups;
        if (groups.length) {
          this.groupExistance = true;
        } else {
          this.groupExistance = false;
        }
      });
  }

  ngOnInit(): void {}
}
