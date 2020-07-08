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

  menuLinks: any[];

  user: User;

  ifTarget: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
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
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                  { label: 'Settings', link: 'settings' },
                  { label: 'Others' },
                ];
                this.menuLinks = [
                  { label: 'Invited groups', link: 'invited-groups' },
                  { label: 'Invited events', link: 'invited-events' },
                  { label: 'Waiting groups', link: 'waiting-groups' },
                  { label: 'Paying groups', link: 'paying-groups' },
                  { label: 'Waiting events', link: 'waiting-events' },
                  { label: 'Paying events', link: 'paying-events' },
                ];
              });
          } else {
            this.userService.getUser(id).subscribe((user: User) => {
              this.user = user;
              if (
                user?.showGroups &&
                user?.showAttendingEvents &&
                user?.showAttendingEvents
              ) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (user?.showGroups && user?.showAttendingEvents) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attending events', link: 'attending-events' },
                ];
              } else if (user?.showGroups && user?.showAttendedEvents) {
                this.routerLinks = [
                  { label: 'Groups', link: 'groups' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (
                user?.showAttendingEvents &&
                user?.showAttendedEvents
              ) {
                this.routerLinks = [
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                ];
              } else if (user?.showGroups) {
                this.routerLinks = [{ label: 'Groups', link: 'groups' }];
              } else if (user?.showAttendingEvents) {
                this.routerLinks = [
                  { label: 'Attending events', link: 'attending-events' },
                ];
              } else if (user?.showAttendedEvents) {
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
