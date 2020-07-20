import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { InviteGetService } from 'src/app/services/invite-get.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-invited-groups',
  templateUrl: './invited-groups.component.html',
  styleUrls: ['./invited-groups.component.scss'],
})
export class InvitedGroupsComponent implements OnInit {
  invitedGroups: Group[];

  allowedToShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invitedGetService: InviteGetService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          if (target.uid === this.authService.uid) {
            this.allowedToShow = true;
          } else {
            if (target.showInvitedGroups) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.invitedGetService
            .getInvitedGroups(id)
            .subscribe((invitedGroups: Group[]) => {
              this.invitedGroups = invitedGroups;
            });
        });
    });
  }

  ngOnInit(): void {}
}
