import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { Group } from 'src/app/interfaces/group';

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
  myAttendingEvents: Event[];
  myAttendedEvents: Event[];
  myShowGroups: boolean;
  myShowAttendingEvents: boolean;
  myShowAttendedEvents: boolean;

  ifTarget: boolean;

  targetUser: User;
  targetDisplayName: string;
  targetPhotoURL: string;
  targetEmail: string;
  targetDescription: string;
  targetGroups: Group[];
  targetGroupsEmpty: boolean;
  targetAttendingEvents: Event[];
  targetAttendedEvents: Event[];
  targetShowGroups: boolean;
  targetShowAttendingEvents: boolean;
  targetShowAttendedEvents: boolean;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const uid = params.get('id');
      console.log(uid);
      if (uid === null) {
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
        this.authService.getUser(this.myUid).subscribe((user: User) => {
          this.myDescription = user.description;
          this.myShowGroups = user.showGroups;
          this.myShowAttendingEvents = user.showAttendingEvents;
          this.myShowAttendedEvents = user.showAttendedEvents;
        });
      } else {
        this.ifTarget = true;
        this.authService.getUser(uid).subscribe((user: User) => {
          console.log(user);
          this.targetUser = user;
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
          this.authService
            .getUser(this.targetUser.uid)
            .subscribe((user: User) => {
              this.targetDescription = user.description;
              this.targetShowGroups = user.showGroups;
              this.targetShowAttendingEvents = user.showAttendingEvents;
              this.targetShowAttendedEvents = user.showAttendedEvents;
            });
        });
      }
    });
  }

  ngOnInit(): void {}

  signOut() {
    this.authService.signOut();
  }

  joinGroup(group: Group) {
    console.log(group);
    this.groupService.joinGroup(this.myUid, group);
  }

  leaveGroup(group: Group) {
    this.groupService.leaveGroup(this.myUid, group);
  }
}
