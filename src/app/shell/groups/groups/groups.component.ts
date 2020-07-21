import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupGetService } from 'src/app/services/group-get.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Group[];

  loading = false;

  constructor(
    private groupGetService: GroupGetService,
    private authService: AuthService
  ) {
    const uid = this.authService.uid;
    this.loading = true;
    setTimeout(() => {
      this.groupGetService.getMyGroup(uid).subscribe((myGroups: Group[]) => {
        this.groups = myGroups;
        this.loading = false;
      });
    }, 1000);
  }

  ngOnInit(): void {}
}
