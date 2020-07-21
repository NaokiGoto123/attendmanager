import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  initialLoading = false;

  allowedToShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupGetService: GroupGetService,
    private userService: UserService,
    private authService: AuthService
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
            if (target.openedGroups) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.groupGetService.getMyGroup(id).subscribe((groups: Group[]) => {
            this.groups = groups;
          });

          setTimeout(() => {
            this.initialLoading = false;
          }, 1000);
        });
    });
  }

  ngOnInit(): void {}
}
