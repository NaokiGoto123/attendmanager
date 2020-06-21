import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-attended-events',
  templateUrl: './attended-events.component.html',
  styleUrls: ['./attended-events.component.scss'],
})
export class AttendedEventsComponent implements OnInit {
  passedEvents: Event[];

  ifPassedEvents: boolean;

  givenEvent: Event;
  creater: User;
  group: Group;
  groupName: string;
  ifAttendingmembers: boolean;
  attendingMembers: Observable<User[]>;
  ifWaitingJoinningMembers: boolean;
  waitingJoinningMembers: Observable<User[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private groupService: GroupService,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.eventService
        .getAttendingEvents(id)
        .subscribe((attendingEvents: Event[]) => {
          if (attendingEvents.length) {
            const now = new Date();
            const events: Event[] = [];
            attendingEvents.forEach((attendedEvent: Event) => {
              if (attendedEvent.date.toDate() < now) {
                console.log(attendedEvent);
                console.log(attendedEvent.date.toDate());
                console.log(now);
                events.push(attendedEvent);
              }
            });
            if (events.length) {
              this.ifPassedEvents = true;
              this.passedEvents = events;
            } else {
              this.ifPassedEvents = false;
            }
          } else {
            this.ifPassedEvents = false;
          }
        });
    });
  }

  ngOnInit(): void {}

  mouseEnter() {
    console.log(this.givenEvent);
    this.authService
      .getUser(this.givenEvent.createrId)
      .subscribe((creater: User) => {
        this.creater = creater;
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
