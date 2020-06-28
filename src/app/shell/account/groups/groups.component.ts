import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.authService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.groupService.getMyGroup(id).subscribe((groups: Group[]) => {
            this.groups = groups;
          });
        });
    });
  }

  ngOnInit(): void {}
}
