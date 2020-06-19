import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  routerLinks: any[];

  user: User;
  uid: string;
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
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id === this.authService.uid || id === null) {
        this.ifTarget = false;
        this.authService
          .getUser(this.authService.uid)
          .subscribe((user: User) => {
            this.user = user;
            this.uid = user.uid;
            this.displayName = user.displayName;
            this.photoURL = user.photoURL;
            this.email = user.email;
            this.description = user.description;
            this.showGroups = user.showGroups;
            this.showAttendingEvents = user.showAttendingEvents;
            this.showAttendedEvents = user.showAttendedEvents;
            this.routerLinks = [
              { label: 'Settings', link: 'settings' },
              { label: 'Groups', link: 'groups' },
              { label: 'Attending events', link: 'attending-events' },
              { label: 'Attended events', link: 'attended-events' },
            ];
          });
      } else {
        this.authService.getUser(id).subscribe((user: User) => {
          console.log(user);
          this.user = user;
          this.uid = user.uid;
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
  }

  ngOnInit(): void {}
}
