import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  value = 'Look for what you want';

  groups$: Observable<Group[]> = this.groupService.getMyGroup(
    this.authService.uid
  );

  nodata: boolean;

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.events === null) {
      this.nodata = true;
    } else {
      this.nodata = false;
    }
    console.log(this.nodata);
  }
}
