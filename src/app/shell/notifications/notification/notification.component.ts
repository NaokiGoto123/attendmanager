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

  userId: string;
  userDisplayname: string;
  userPhotoURL: string;

  groupId: string;
  groupName: string;

  eventId: string;
  eventName: string;

  date: number;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    //   if (this.notification) {
    //     this.authService
    //       .getUser(this.notification.personUid)
    //       .subscribe((user: User) => {
    //         this.userId = user.uid;
    //         this.userDisplayname = user.displayName;
    //         this.userPhotoURL = user.photoURL;
    //       });
    //     // tslint:disable-next-line: max-line-length
    //     if (
    //       this.notification.type === 'joinGroup' ||
    //       this.notification.type === 'makeAdmin' ||
    //       this.notification.type === 'makeEvent' ||
    //       this.notification.type === 'joinGroupWaitinglist'
    //     ) {
    //       this.groupService
    //         .getGroupinfo(this.notification.objectId)
    //         .subscribe((group: Group) => {
    //           this.groupId = group.id;
    //           this.groupName = group.name;
    //         });
    //       this.date = this.notification.date.toMillis();
    //     } else if (
    //       this.notification.type === 'joinEvent' ||
    //       this.notification.type === 'joinEventWaitinglist'
    //     ) {
    //       this.eventService
    //         .getEvent(this.notification.objectId)
    //         .subscribe((event: Event) => {
    //           this.eventId = event.id;
    //           this.eventName = event.title;
    //         });
    //       this.date = this.notification.date.toMillis();
    //     }
    //   }
    // }
  }
}
