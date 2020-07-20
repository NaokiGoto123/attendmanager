import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { GroupGetService } from 'src/app/services/group-get.service';

@Component({
  selector: 'app-waiting-joinning-groups',
  templateUrl: './waiting-joinning-groups.component.html',
  styleUrls: ['./waiting-joinning-groups.component.scss'],
})
export class WaitingJoinningGroupsComponent implements OnInit {
  waitingJoinningGroups: Group[];

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
            if (target.showWaitingGroups) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.groupGetService
            .getWaitingJoinningGroups(id)
            .subscribe((waitingJoinningGroups: Group[]) => {
              this.waitingJoinningGroups = waitingJoinningGroups;
            });

          setTimeout(() => {
            this.initialLoading = false;
          }, 1000);
        });
    });
  }

  ngOnInit(): void {}
}
