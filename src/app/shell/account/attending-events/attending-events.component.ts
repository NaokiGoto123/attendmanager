import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { Observable, combineLatest } from 'rxjs';
@Component({
  selector: 'app-attending-events',
  templateUrl: './attending-events.component.html',
  styleUrls: ['./attending-events.component.scss'],
})
export class AttendingEventsComponent implements OnInit {
  attendingEvents: Event[];

  ifAttendingEvents: boolean;

  givenEvent: Event;
  creater: User;
  createrId: string;
  createrDisplayname: string;
  group: Group;
  groupName: string;
  ifAttendingmembers: boolean;
  attendingMembers: Observable<User[]>;
  ifWaitingJoinningMembers: boolean;
  waitingJoinningMembers: Observable<User[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private groupService: GroupService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.eventService
        .getAttendingEvents(id)
        .subscribe((attendingEvents: Event[]) => {
          if (attendingEvents.length) {
            this.ifAttendingEvents = true;
            const now = new Date();
            const events: Event[] = [];
            attendingEvents.forEach((attendingEvent: Event) => {
              if (attendingEvent.date.toDate() > now) {
                events.push(attendingEvent);
              }
            });
            console.log(events);
            this.attendingEvents = events;
          } else {
            this.ifAttendingEvents = false;
          }
        });
    });
  }

  ngOnInit(): void {}

  mouseEnter() {
    this.authService
      .getUser(this.givenEvent.createrId)
      .subscribe((creater: User) => {
        this.creater = creater;
        this.createrId = creater.uid;
        this.createrDisplayname = creater.displayName;
      });

    this.groupService
      .getGroupinfo(this.givenEvent.groupid)
      .subscribe((group: Group) => {
        this.group = group;
        this.groupName = group.name;
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
}
