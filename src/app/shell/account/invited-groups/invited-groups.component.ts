import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { InviteGetService } from 'src/app/services/invite-get.service';
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
    private invitedGetService: InviteGetService,
    private userService: UserService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
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
