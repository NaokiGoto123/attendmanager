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

  existance: boolean;

  groups: Group[];

  events: Event[];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService
  ) {
    this.eventService
      .getEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        this.events = events;
        if (events.length) {
          this.existance = true;
        } else {
          this.existance = false;
        }
      });
    this.groupService
      .getMyGroup(this.authService.uid)
      .subscribe((groups: Group[]) => {
        this.groups = groups;
      });
  }

  ngOnInit(): void {}
}
