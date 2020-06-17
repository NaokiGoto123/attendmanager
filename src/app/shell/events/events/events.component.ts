import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { EventService } from 'src/app/services/event.service';
import { Observable, combineLatest } from 'rxjs';
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

  nodata = true;

  groups$: Observable<Group[]> = this.groupService.getMyGroup(
    this.authService.uid
  );

  events: Observable<Event[]> = this.eventService.getEvents(
    this.authService.uid
  );

  givenEvent: Event;

  creater: User;

  groupName: string;

  attendingMembers: Observable<User[]>;

  ifAttendingmembers = false;

  waitingJoinningMembers: Observable<User[]>;

  ifWaitingJoinningMembers = false;

  mouseOver() {
    this.authService
      .getUser(this.givenEvent.createrId)
      .subscribe((creater: User) => {
        this.creater = creater;
      });

    this.groupService
      .getGroupName(this.givenEvent.groupid)
      .subscribe((groupName: string) => {
        this.groupName = groupName;
      });

    if (this.givenEvent.attendingMemberIds.length) {
      this.ifAttendingmembers = true;
      const result: Observable<User>[] = [];
      this.givenEvent.attendingMemberIds.forEach((attndingmemberId) => {
        result.push(this.authService.getUser(attndingmemberId));
        this.attendingMembers = combineLatest(result);
      });
    } else {
      this.ifAttendingmembers = false;
    }

    if (this.givenEvent.waitingJoinningMemberIds.length) {
      this.ifWaitingJoinningMembers = true;
      this.waitingJoinningMembers = combineLatest(
        this.givenEvent.waitingJoinningMemberIds.map(
          (waitingJoinningMemberId) => {
            return this.authService.getUser(waitingJoinningMemberId);
          }
        )
      );
    } else {
      this.ifWaitingJoinningMembers = false;
    }
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
