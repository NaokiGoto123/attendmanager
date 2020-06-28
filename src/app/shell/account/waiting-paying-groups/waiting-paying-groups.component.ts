import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-waiting-paying-groups',
  templateUrl: './waiting-paying-groups.component.html',
  styleUrls: ['./waiting-paying-groups.component.scss'],
})
export class WaitingPayingGroupsComponent implements OnInit {
  waitingPayingGroups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private groupService: GroupService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.authService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.groupService
            .getWaitingPayingGroups(id)
            .subscribe((waitingPayingGroups: Group[]) => {
              this.waitingPayingGroups = waitingPayingGroups;
            });
        });
    });
  }

  ngOnInit(): void {}
}
