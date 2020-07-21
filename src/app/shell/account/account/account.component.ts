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
          const id = target?.uid;
          if (id === this.authService.uid || id === null) {
            this.ifTarget = false;
            this.userService
              .getUser(this.authService.uid)
              .subscribe((user: User) => {
                this.user = user;
                this.routerLinks = [
                  { label: 'Attending events', link: 'attending-events' },
                  { label: 'Attended events', link: 'attended-events' },
                  { label: 'Others' },
                ];
              });
          } else {
            this.userService.getUser(id).subscribe((user: User) => {
              this.user = user;
              this.routerLinks = [
                { label: 'Attending events', link: 'attending-events' },
                { label: 'Attended events', link: 'attended-events' },
                { label: 'Groups', link: 'groups' },
                { label: 'Others' },
              ];
            });
          }
        });
    });
  }

  ngOnInit(): void {}
}
