import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-waiting-joinning-groups',
  templateUrl: './waiting-joinning-groups.component.html',
  styleUrls: ['./waiting-joinning-groups.component.scss'],
})
export class WaitingJoinningGroupsComponent implements OnInit {
  waitingJoinningGroups: Group[];

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
            .getWaitingJoinningGroups(id)
            .subscribe((waitingJoinningGroups: Group[]) => {
              this.waitingJoinningGroups = waitingJoinningGroups;
            });
        });
    });
  }

  ngOnInit(): void {}
}
