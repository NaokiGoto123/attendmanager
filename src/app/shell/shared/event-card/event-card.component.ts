import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  uid: string;

  ifEvent = false;

  ifadmin: boolean; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  ifWaitingJoinningMember: boolean;

  ifWaitingPayingMember: boolean;

  ifPast: boolean;

  attended = false;

  creater: User;

  group: Group;

  overMemberLimit: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    public eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.event) {
      this.uid = this.authService.uid;

      this.userService
        .getUser(this.event.createrId)
        .subscribe((creater: User) => {
          this.creater = creater;
        });

      this.groupService
        .getGroupinfo(this.event.groupid)
        .subscribe((group: Group) => {
          this.group = group;
        });

      this.eventService
        .getWaitingJoinningMemberIds(this.event.id)
        .subscribe((waitingJoinningMemberIds: string[]) => {
          if (waitingJoinningMemberIds.includes(this.authService.uid)) {
            this.ifWaitingJoinningMember = true;
          } else {
            this.ifWaitingJoinningMember = false;
          }
        });

      this.eventService
        .getWaitingPayingMemberIds(this.event.id)
        .subscribe((waitingPayingMemberIds: string[]) => {
          if (waitingPayingMemberIds.includes(this.authService.uid)) {
            this.ifWaitingPayingMember = true;
          } else {
            this.ifWaitingPayingMember = false;
          }
        });

      const now = new Date();

      if (this.event.date.toDate() > now) {
        this.ifPast = false;
      } else {
        this.ifPast = true;
      }

      this.groupService
        .ifAdmin(this.uid, this.event.groupid)
        .subscribe((ifAdmin: boolean) => {
          this.ifadmin = ifAdmin;
        });

      this.eventService
        .getAttendingMemberIds(this.event.id)
        .subscribe((attendingMemberIds: string[]) => {
          if (this.event.memberlimit !== null) {
            if (attendingMemberIds.length >= this.event.memberlimit) {
              this.overMemberLimit = true;
            } else {
              this.overMemberLimit = false;
            }
          }
          if (attendingMemberIds.includes(this.authService.uid)) {
            this.attended = true;
          } else {
            this.attended = false;
          }
        });

      this.ifEvent = true;
    } else {
      this.ifEvent = false;
    }
  }

  // nothing to attending (pay+public, pay+private, free+public, free+private)
  attendEvent() {
    this.eventService.attendEvent(this.uid, this.event?.id);
  }

  payToAttendEvent() {
    this.eventService.payToAttendEvent(this.uid, this.event?.id);
  }

  // attending to nothing (pay+public, pay+private, free+public, free+private)
  leaveEvent() {
    this.eventService.leaveEvent(this.uid, this.event?.id);
  }

  // nothing to waitingJoinning (pay+private, free+private)
  joinWaitingJoinningList() {
    this.eventService.joinWaitingJoinningList(this.uid, this.event?.id);
  }

  // waitingJoinning to waitingPaying (pay+private)
  joinWaitingPayingList() {
    this.eventService.joinWaitingPayingList(this.uid, this.event?.id);
  }

  // waitingJoinning to nothing (pay+private, free+private)
  removeWaitingJoinningMember() {
    this.eventService.removeWaitingJoinningMember(this.uid, this.event?.id);
  }

  // waitingPaying to nothing (pay+private)
  removeWaitingPayingMember() {
    this.eventService.removeWaitingPayingMember(this.uid, this.event?.id);
  }
}
