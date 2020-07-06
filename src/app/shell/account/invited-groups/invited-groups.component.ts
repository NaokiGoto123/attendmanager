import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { InviteService } from 'src/app/services/invite.service';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-invited-groups',
  templateUrl: './invited-groups.component.html',
  styleUrls: ['./invited-groups.component.scss'],
})
export class InvitedGroupsComponent implements OnInit {
  invitedGroups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private invitedService: InviteService,
    private userService: UserService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.invitedService
            .getInvitedGroups(id)
            .subscribe((invitedGroups: Group[]) => {
              this.invitedGroups = invitedGroups;
            });
        });
    });
  }

  ngOnInit(): void {}
}
