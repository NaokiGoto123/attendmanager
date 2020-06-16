import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { Observable, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  value = 'Look for what you want';

  uid: string;

  nodata: boolean;

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  searchableGroups: Group[];

  searchableEvents: Event[];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.uid = this.authService.uid;
    if (this.events === null) {
      this.nodata = true;
    } else {
      this.nodata = false;
    }
    this.groupService.getSearchableGroups().subscribe((groups) => {
      this.searchableGroups = groups;
    });
    this.eventService.getSearchableEvents().subscribe((events) => {
      this.searchableEvents = events;
    });
  }

  joinGroup(group: Group) {
    this.groupService.joinGroup(this.uid, group);
  }

  leaveGroup(group: Group) {
    this.groupService.leaveGroup(this.uid, group);
  }
}
