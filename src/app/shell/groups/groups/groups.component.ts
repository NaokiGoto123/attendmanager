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
  value = '';

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
}
