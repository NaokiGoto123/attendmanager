import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-waiting-joinning-groups',
  templateUrl: './waiting-joinning-groups.component.html',
  styleUrls: ['./waiting-joinning-groups.component.scss'],
})
export class WaitingJoinningGroupsComponent implements OnInit {
  waitingJoinningGroups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.groupService
        .getWaitingJoinningGroups(id)
        .subscribe((waitingJoinningGroups: Group[]) => {
          this.waitingJoinningGroups = waitingJoinningGroups;
        });
    });
  }

  ngOnInit(): void {}
}
