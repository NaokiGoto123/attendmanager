import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  value = 'Look for what you want';

  groups$: Observable<Group[]> = this.groupService.getMyGroup(
    this.authService.uid
  );

  nodata: boolean;

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    if (this.events === null) {
      this.nodata = true;
    } else {
      this.nodata = false;
    }
    console.log(this.nodata);
  }

  navigateToCreateEvent() {
    this.router.navigateByUrl('create-event');
  }
}
