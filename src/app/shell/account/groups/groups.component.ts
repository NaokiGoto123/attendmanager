import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { GroupGetService } from 'src/app/services/group-get.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Group[];

  allowedToShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private groupGetService: GroupGetService,
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
            if (target.showAttendedEvents) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.groupGetService.getMyGroup(id).subscribe((groups: Group[]) => {
            this.groups = groups;
          });
        });
    });
  }

  ngOnInit(): void {}
}
