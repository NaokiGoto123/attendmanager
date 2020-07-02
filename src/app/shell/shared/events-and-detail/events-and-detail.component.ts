import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { timeStamp } from 'console';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-events-and-detail',
  templateUrl: './events-and-detail.component.html',
  styleUrls: ['./events-and-detail.component.scss'],
})
export class EventsAndDetailComponent implements OnInit {
  @Input() events: Event[];

  @Input() existance: boolean;

  givenEvent: Event;

  ifAdmin: boolean;

  createrName: string;
  createrId: string;
  groupName: string;
  groupId: string;
  ifAttendingMembers: boolean;
  attendingMembers: Observable<User[]>;
  ifWaitingJoinningMembers: boolean;
  waitingJoinningMembers: Observable<User[]>;

  noExist: boolean;

  constructor(
    private eventService: EventService,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  mouseEnter() {
    console.log(this.givenEvent);
    this.userService
      .getUser(this.givenEvent.createrId)
      .subscribe((creater: User) => {
        this.createrId = creater.uid;
        this.createrName = creater.displayName;
      });

    this.groupService
      .getGroupinfo(this.givenEvent.groupid)
      .subscribe((group: Group) => {
        this.groupId = group.id;
        this.groupName = group.name;
        this.groupService
          .ifAdmin(this.authService.uid, this.groupId)
          .subscribe((ifAdmin: boolean) => {
            this.ifAdmin = ifAdmin;
          });
      });

    this.eventService
      .getAttendingMemberIds(this.givenEvent.id)
      .subscribe((attendingMemberIds: string[]) => {
        if (attendingMemberIds.length) {
          this.ifAttendingMembers = true;
          const result: Observable<User>[] = [];
          attendingMemberIds.forEach((attndingmemberId) => {
            result.push(this.userService.getUser(attndingmemberId));
            this.attendingMembers = combineLatest(result);
          });
        } else {
          this.ifAttendingMembers = false;
        }
      });

    this.eventService
      .getWaitingJoinningMemberIds(this.givenEvent.id)
      .subscribe((waitingJoinningMemberIds: string[]) => {
        if (waitingJoinningMemberIds.length) {
          this.ifWaitingJoinningMembers = true;
          this.waitingJoinningMembers = combineLatest(
            waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
              return this.userService.getUser(waitingJoinningMemberId);
            })
          );
        } else {
          this.ifWaitingJoinningMembers = false;
        }
      });
  }

  // waitingJoinning to attending (free+private)
  waitingJoinningMemberToAttendingMember(uid: string, eventId: string) {
    this.eventService.waitingJoinningMemberToAttendingMember(uid, eventId);
  }

  // waitingJoinning to nothing (pay+private, free+private)
  removeWaitingJoinningMember(uid: string, eventId: string) {
    this.eventService.removeWaitingJoinningMember(uid, eventId);
  }

  // waitingJoinning to waitingPaying (pay+private)
  joinWaitingPayingList(uid: string, eventId: string) {
    this.eventService.joinWaitingPayingList(uid, eventId);
  }
}
