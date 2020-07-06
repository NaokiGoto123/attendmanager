import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/interfaces/notification';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { EventService } from 'src/app/services/event.service';
import { User } from 'src/app/interfaces/user';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() notification: Notification;

  personId: string;
  personSearchId: string;
  personDisplayname: string;
  personPhotoURL: string;

  group: Group;
  groupId: string;
  groupName: string;
  groupPicture: string;

  event: Event;
  eventId: string;
  eventName: string;

  date: number;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.notification) {
      this.date = this.notification.date.toMillis();
      if (
        this.notification.type === 'joinGroup' ||
        this.notification.type === 'joinGroupWaitinglist' ||
        this.notification.type === 'makeAdmin'
      ) {
        this.personId = this.notification.person.uid;
        this.personSearchId = this.notification.person.searchId;
        this.personDisplayname = this.notification.person.displayName;
        this.personPhotoURL = this.notification.person.photoURL;
        this.group = this.notification.group;
        this.groupId = this.notification.group.id;
        this.groupName = this.notification.group.name;
        this.groupPicture = this.notification.group.grouppicture;
      } else if (this.notification.type === 'makeEvent') {
        this.group = this.notification.group;
        this.groupId = this.notification.group.id;
        this.groupName = this.notification.group.name;
        this.groupPicture = this.notification.group.grouppicture;
        this.event = this.notification.event;
        this.eventId = this.notification.event.id;
        this.eventName = this.notification.event.title;
      } else if (
        this.notification.type === 'joinEvent' ||
        this.notification.type === 'joinEventWaitinglist'
      ) {
        this.personId = this.notification.person.uid;
        this.personSearchId = this.notification.person.searchId;
        this.personDisplayname = this.notification.person.displayName;
        this.personPhotoURL = this.notification.person.photoURL;
        this.group = this.notification.group;
        this.groupId = this.notification.group.id;
        this.groupName = this.notification.group.name;
        this.groupPicture = this.notification.group.grouppicture;
        this.event = this.notification.event;
        this.eventId = this.notification.event.id;
        this.eventName = this.notification.event.title;
      } else if (
        this.notification.type === 'invitingUser' ||
        this.notification.type === 'getInvitation'
      ) {
        this.personId = this.notification.person.uid;
        this.personSearchId = this.notification.person.searchId;
        this.personDisplayname = this.notification.person.displayName;
        this.personPhotoURL = this.notification.person.photoURL;
        this.group = this.notification.group;
        this.groupId = this.notification.group.id;
        this.groupName = this.notification.group.name;
        this.groupPicture = this.notification.group.grouppicture;
      }
    }
  }
}
