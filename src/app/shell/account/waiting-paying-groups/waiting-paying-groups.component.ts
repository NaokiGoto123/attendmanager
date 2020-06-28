import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-waiting-paying-groups',
  templateUrl: './waiting-paying-groups.component.html',
  styleUrls: ['./waiting-paying-groups.component.scss'],
})
export class WaitingPayingGroupsComponent implements OnInit {
  waitingPayingGroups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.groupService
        .getWaitingPayingGroups(id)
        .subscribe((waitingPayingGroups: Group[]) => {
          this.waitingPayingGroups = waitingPayingGroups;
        });
    });
  }

  ngOnInit(): void {}
}
