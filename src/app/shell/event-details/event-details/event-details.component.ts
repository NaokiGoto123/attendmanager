import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  event: Event;

  creater: User;

  group: Group;

  constructor(
    private actvatedRoute: ActivatedRoute,
    private userService: UserService,
    private groupService: GroupService,
    private eventService: EventService
  ) {
    this.actvatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.eventService.getEvent(id).subscribe((event: Event) => {
        this.event = event;
        this.userService.getUser(event.createrId).subscribe((creater: User) => {
          this.creater = creater;
        });
        this.groupService
          .getGroupinfo(event.groupid)
          .subscribe((group: Group) => {
            this.group = group;
          });
      });
    });
  }

  ngOnInit(): void {}
}
