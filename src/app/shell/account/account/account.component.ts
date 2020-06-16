import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { Group } from 'src/app/interfaces/group';
import { Event } from 'src/app/interfaces/event';
import { FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  myUid: string;
  myDisplayName: string;
  myPhotoURL: string;
  myEmail: string;
  myDescription: string;
  myGroups: Group[];
  myGroupsEmpty: boolean;
  myAttendingEvents: Event[]; // work
  myNoAttendingEvents: boolean;
  myAttendedEvents: Event[]; // work
  myNoAttendedEvents: boolean;
  myShowGroups: boolean;
  myShowAttendingEvents: boolean;
  myShowAttendedEvents: boolean;

  form = this.fb.group({
    displayName: [this.myDisplayName],
    description: [this.myDescription],
    showGroups: [this.myShowGroups],
    showAttendingEvents: [this.myShowAttendingEvents],
    showAttendedEvents: [this.myShowAttendedEvents],
  });

  ifTarget: boolean;

  targetUser: User;
  targetUid: string;
  targetDisplayName: string;
  targetPhotoURL: string;
  targetEmail: string;
  targetDescription: string;
  targetGroups: Group[];
  targetGroupsEmpty: boolean;
  targetAttendingEvents: Event[]; // work
  targetNoAttendingEvents: boolean;
  targetAttendedEvents: Event[]; // work
  targetNoAttendedEvents: boolean;
  targetShowGroups: boolean;
  targetShowAttendingEvents: boolean;
  targetShowAttendedEvents: boolean;

  noTabs: boolean;

  givenAttendingEvent: Event;
  AttendingCreater: User;
  AttendingGroupName: string;
  AttendingAttendingmembersNames: string[];
  AttendingIfAttendingmembers: boolean;

  givenAttendedEvent: Event;
  AttendedCreater: User;
  AttendedGroupName: string;
  AttendedAttendingmembersNames: string[];
  AttendedIfAttendingmembers: boolean;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const uid = params.get('id');
      if (uid === null) {
        // 自分のページだった場合の処理
        this.ifTarget = false;
        this.myUid = this.authService.uid;
        this.authService
          .getName(this.myUid)
          .subscribe((displayName: string) => {
            this.myDisplayName = displayName;
          });
        this.myPhotoURL = this.authService.photoURL;
        this.myEmail = this.authService.email;
        this.groupService
          .getMyGroup(this.myUid)
          .subscribe((groups: Group[]) => {
            if (groups.length) {
              this.myGroupsEmpty = false;
              this.myGroups = groups;
            } else {
              this.myGroupsEmpty = true;
              this.myGroups = [];
            }
          });
        console.log('start');
        this.eventService
          .getAttendingEvents(this.authService.uid)
          .subscribe((events: Event[]) => {
            console.log(events);
            const now = new Date();
            const attendingEvents: Event[] = [];
            const attendedEvents: Event[] = [];
            events.map((event: Event) => {
              if (event.date.toDate() > now) {
                attendingEvents.push(event);
              } else {
                attendedEvents.push(event);
              }
            });
            if (attendingEvents.length) {
              this.myNoAttendingEvents = false;
            } else {
              this.myNoAttendingEvents = true;
            }
            if (attendedEvents.length) {
              this.myNoAttendedEvents = false;
            } else {
              this.myNoAttendedEvents = true;
            }
            this.myAttendingEvents = attendingEvents;
            this.myAttendedEvents = attendedEvents;
          });
        console.log('end');
        this.authService.getUser(this.myUid).subscribe((user: User) => {
          this.myDescription = user.description;
          this.myShowGroups = user.showGroups;
          this.myShowAttendingEvents = user.showAttendingEvents;
          this.myShowAttendedEvents = user.showAttendedEvents;
          this.form.patchValue(user);
        });
      } else {
        if (uid === this.authService.uid) {
          // 自分のページだった場合の処理
          this.ifTarget = false;
          this.myUid = this.authService.uid;
          this.myDisplayName = this.authService.displayName;
          this.myPhotoURL = this.authService.photoURL;
          this.myEmail = this.authService.email;
          this.groupService
            .getMyGroup(this.myUid)
            .subscribe((groups: Group[]) => {
              if (groups.length) {
                this.myGroupsEmpty = false;
                this.myGroups = groups;
              } else {
                this.myGroupsEmpty = true;
                this.myGroups = [];
              }
            });
          this.eventService
            .getAttendingEvents(this.authService.uid)
            .subscribe((events: Event[]) => {
              const now = new Date();
              const attendingEvents: Event[] = [];
              const attendedEvents: Event[] = [];
              events.map((event: Event) => {
                console.log(event);
                if (event.date.toDate() > now) {
                  attendingEvents.push(event);
                } else {
                  attendedEvents.push(event);
                }
              });
              if (attendingEvents.length) {
                this.myNoAttendingEvents = false;
              } else {
                this.myNoAttendingEvents = true;
              }
              if (attendedEvents.length) {
                this.myNoAttendedEvents = false;
              } else {
                this.myNoAttendedEvents = true;
              }
              this.myAttendingEvents = attendingEvents;
              this.myAttendedEvents = attendedEvents;
            });
          this.authService.getUser(this.myUid).subscribe((user: User) => {
            this.myDescription = user.description;
            this.myShowGroups = user.showGroups;
            this.myShowAttendingEvents = user.showAttendingEvents;
            this.myShowAttendedEvents = user.showAttendedEvents;
            this.form.patchValue(user);
          });
        } else {
          // 自分以外のユーザーのページを見るときの処理
          this.myUid = this.authService.uid;
          this.ifTarget = true;
          this.authService.getUser(uid).subscribe((user: User) => {
            this.targetUser = user;
            this.targetUid = uid;
            this.targetDisplayName = user.displayName;
            this.targetPhotoURL = user.photoURL;
            this.targetEmail = user.email;
            this.groupService.getMyGroup(uid).subscribe((groups: Group[]) => {
              if (groups.length) {
                this.targetGroupsEmpty = false;
                this.targetGroups = groups;
              } else {
                this.targetGroupsEmpty = true;
                this.targetGroups = [];
              }
            });
            this.eventService
              .getAttendingEvents(this.targetUid)
              .subscribe((events: Event[]) => {
                const now = new Date();
                const attendingEvents: Event[] = [];
                const attendedEvents: Event[] = [];
                events.map((event: Event) => {
                  console.log(event);
                  if (event.date.toDate() > now) {
                    attendingEvents.push(event);
                  } else {
                    console.log('attended events');
                    attendedEvents.push(event);
                  }
                });
                if (attendingEvents.length) {
                  this.targetNoAttendingEvents = false;
                } else {
                  this.targetNoAttendingEvents = true;
                }
                if (attendedEvents.length) {
                  this.targetNoAttendedEvents = false;
                } else {
                  this.targetNoAttendedEvents = true;
                }
                this.targetAttendingEvents = attendingEvents;
                this.targetAttendedEvents = attendedEvents;
              });
            this.authService
              .getUser(this.targetUser.uid)
              .subscribe((user: User) => {
                this.targetDescription = user.description;
                this.targetShowGroups = user.showGroups;
                this.targetShowAttendingEvents = user.showAttendingEvents;
                this.targetShowAttendedEvents = user.showAttendedEvents;
                if (
                  !user.showGroups &&
                  !user.showAttendingEvents &&
                  !user.showAttendedEvents
                ) {
                  this.noTabs = true;
                } else {
                  this.noTabs = false;
                }
              });
          });
        }
      }
    });
  }

  ngOnInit(): void {}

  signOut() {
    this.authService.signOut();
  }

  joinGroup(group: Group) {
    this.groupService.joinGroup(this.authService.uid, group);
  }

  leaveGroup(group: Group) {
    this.groupService.leaveGroup(this.authService.uid, group);
  }

  joinWaitingList(group: Group) {
    this.groupService.joinWaitingList(this.authService.uid, group.id);
  }

  leaveWaitingList(group: Group) {
    this.groupService.leaveWaitingList(this.authService.uid, group.id);
  }

  updateUser() {
    this.authService.updateUser({
      uid: this.myUid,
      displayName: this.form.value.displayName,
      email: this.myEmail,
      photoURL: this.myPhotoURL,
      description: this.form.value.description,
      showGroups: this.form.value.showGroups,
      showAttendingEvents: this.form.value.showAttendingEvents,
      showAttendedEvents: this.form.value.showAttendedEvents,
    });
  }

  AttendingMouseOver() {
    this.authService
      .getUser(this.givenAttendingEvent.createrId)
      .subscribe((creater: User) => {
        this.AttendingCreater = creater;
      });

    this.groupService
      .getGroupName(this.givenAttendingEvent.groupid)
      .subscribe((groupName: string) => {
        this.AttendingGroupName = groupName;
      });

    const AttendingAttendingmembersNames: string[] = [];
    this.givenAttendingEvent.attendingMemberIds.map((attendingmemberId) => {
      let attendingmemberName = '';
      this.authService
        .getName(attendingmemberId)
        .subscribe((originalAttendingmemberName: string) => {
          attendingmemberName = originalAttendingmemberName;
          AttendingAttendingmembersNames.push(attendingmemberName);
        });
    });
    this.AttendingAttendingmembersNames = AttendingAttendingmembersNames;

    if (this.givenAttendingEvent.attendingMemberIds.length) {
      this.AttendingIfAttendingmembers = true;
    } else {
      this.AttendingIfAttendingmembers = false;
    }
  }

  AttendedMouseOver() {
    this.authService
      .getUser(this.givenAttendedEvent.createrId)
      .subscribe((creater: User) => {
        this.AttendedCreater = creater;
        console.log(creater);
      });

    this.groupService
      .getGroupName(this.givenAttendedEvent.groupid)
      .subscribe((groupName: string) => {
        this.AttendedGroupName = groupName;
      });

    const AttendedAttendingmembersNames: string[] = [];
    this.givenAttendedEvent.attendingMemberIds.forEach((attendingmember) => {
      let attendingmemberName = '';
      this.authService
        .getName(attendingmember)
        .subscribe((originalAttndingmemberName: string) => {
          attendingmemberName = originalAttndingmemberName;
          AttendedAttendingmembersNames.push(attendingmemberName);
        });
    });
    this.AttendedAttendingmembersNames = AttendedAttendingmembersNames;

    if (this.givenAttendedEvent.attendingMemberIds.length) {
      this.AttendedIfAttendingmembers = true;
    } else {
      this.AttendedIfAttendingmembers = false;
    }
  }
}
