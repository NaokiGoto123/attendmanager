import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { GroupGetService } from 'src/app/services/group-get.service';

@Component({
  selector: 'app-waiting-paying-groups',
  templateUrl: './waiting-paying-groups.component.html',
  styleUrls: ['./waiting-paying-groups.component.scss'],
})
export class WaitingPayingGroupsComponent implements OnInit {
  waitingPayingGroups: Group[];

  initialLoading = false;

  allowedToShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private groupGetService: GroupGetService
  ) {
    this.initialLoading = true;
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          if (target.uid === this.authService.uid) {
            this.allowedToShow = true;
          } else {
            if (target.openedPayingGroups) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.groupGetService
            .getWaitingPayingGroups(id)
            .subscribe((waitingPayingGroups: Group[]) => {
              this.waitingPayingGroups = waitingPayingGroups;
            });

          setTimeout(() => {
            this.initialLoading = false;
          }, 1000);
        });
    });
  }

  ngOnInit(): void {}
}
