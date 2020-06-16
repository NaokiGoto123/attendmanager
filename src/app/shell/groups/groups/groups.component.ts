import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  value = 'Look for what you want';

  uid: string;

  groups: Observable<Group[]> = this.groupService.getMyGroup(
    this.authService.uid
  );

  constructor(
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.uid = this.authService.uid;
  }

  leaveGroup(group: Group) {
    this.groupService.leaveGroup(this.authService.uid, group);
  }
}
