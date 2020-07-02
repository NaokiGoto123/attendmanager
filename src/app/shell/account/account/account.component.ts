import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  routerLinks: any[];

  user: User;
  uid: string;
  searchId: string;
  displayName: string;
  photoURL: string;
  email: string;
  description: string;
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;

  ifTarget: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log(params);
      const searchId = params.get('id');
      console.log(searchId);
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          if (id === this.authService.uid || id === null) {
            this.ifTarget = false;
            this.userService
              .getUser(this.authService.uid)
              .subscribe((user: User) => {
                this.user = user;
                this.uid = user.uid;
                this.searchId = user.searchId;
                this.displayName = user.displayName;
                this.photoURL = user.photoURL;
                this.email = user.email;
                this.description = user.description;
                this.showGroups = user.showGroups;
                this.showAttendingEvents = user.showAttendingEvents;
                this.showAttendedEvents = user.showAttendedEvents;
                this.routerLinks = [
                  { label: 'Settings', link: 'settings' },
                  { label: 'Invited groups', link: 'invited-groups' },
                  { label: 'Invited events', link: 'invited-events' },
                  { label: 'Waiting groups', link: 'waiting-groups' },
                  { label: 'Paying groups', link: 'paying-groups' },
                  { label: 'Waiting events', link: 'waiting-events' },
                  { label: 'Paying events', link: 'paying-events' },
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              });
          } else {
            this.userService.getUser(id).subscribe((user: User) => {
              console.log(user);
              this.user = user;
              this.uid = user.uid;
              this.searchId = user.searchId;
              this.displayName = user.displayName;
              this.photoURL = user.photoURL;
              this.email = user.email;
              this.description = user.description;
              this.showGroups = user.showGroups;
              this.showAttendingEvents = user.showAttendingEvents;
              this.showAttendedEvents = user.showAttendedEvents;
              if (
                this.showGroups &&
                this.showAttendingEvents &&
                this.showAttendingEvents
              ) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (this.showGroups && this.showAttendingEvents) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                ];
              } else if (this.showGroups && this.showAttendedEvents) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (this.showAttendingEvents && this.showAttendedEvents) {
                this.routerLinks = [
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (this.showGroups) {
                this.routerLinks = [{ label: 'Groups', link: 'groups' }];
              } else if (this.showAttendingEvents) {
                this.routerLinks = [
                  { label: 'Attending events', link: 'attending-events' },
                ];
              } else if (this.showAttendedEvents) {
                this.routerLinks = [
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else {
                this.routerLinks = [];
              }
            });
          }
        });
    });
  }

  ngOnInit(): void {}
}
