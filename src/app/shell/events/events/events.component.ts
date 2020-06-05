import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  value = 'Look for what you want';

  nodata = true;

  groups$: Observable<Group[]> = this.groupService.getMyGroup(
    this.authService.uid
  );

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  givenEvent: Event;

  createrName: string;

  groupName: string;

  attendingmembersNames: Observable<string[]>;

  ifAttendingmembers = false;

  mouseOver() {
    this.authService
      .getName(this.givenEvent.creater)
      .subscribe((createrName: string) => {
        this.createrName = createrName;
      });

    this.groupService
      .getGroupName(this.givenEvent.groupid)
      .subscribe((groupName: string) => {
        this.groupName = groupName;
      });

    const result: Observable<string>[] = [];
    this.givenEvent.attendingmembers.forEach((attndingmember) => {
      result.push(this.authService.getName(attndingmember));
      this.attendingmembersNames = combineLatest(result);
    });

    if (this.givenEvent.attendingmembers.length) {
      this.ifAttendingmembers = true;
    } else {
      this.ifAttendingmembers = false;
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.events.subscribe((events: Event[]) => {
      if (events.length) {
        this.nodata = false;
      } else {
        this.nodata = true;
      }
    });
  }
}
