import { Component, OnInit, Input } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  @Input() group: Group;

  uid: string;

  constructor(
    private authService: AuthService,
    private groupService: GroupService
  ) {
    this.uid = this.authService.uid;
  }

  ngOnInit(): void {}

  // nothing to waitingJoinning (private+pay, private+free)
  joinWaitingJoinningList() {
    this.groupService.joinWaitingJoinningList(this.uid, this.group.id);
  }

  // waitingJoinning list to nothing (private+pay, private+free)
  leaveWaitingList() {
    this.groupService.leaveWaitingList(this.uid, this.group.id);
  }

  // waitingJoinning to waitingPaying (private+pay)
  waitingJoinningMemberToWaitingPayingMember() {
    this.groupService.waitingJoinningMemberToWaitingPayingMember(
      this.uid,
      this.group.id
    );
  }

  // waitingPayinglist to member (private+pay)
  waitingPayinglistToMember() {
    this.groupService.waitingPayinglistToMember(this.uid, this.group.id);
  }

  // waitingPaying to nothing (private+pay)
  removeWaitingPayingMember() {
    this.groupService.removeWaitingPayingMember(this.uid, this.group.id);
  }

  // member to nothing (private+free, private+pay, public+free, public+pay)
  leaveGroup() {
    this.groupService.leaveGroup(this.uid, this.group);
  }

  // nothing to member (public+free)
  joinGroup() {
    this.groupService.joinGroup(this.uid, this.group.id);
  }

  // nothing to member (public+pay)
  patToJoinGroup() {
    this.groupService.patToJoinGroup(this.uid, this.group.id);
  }

  // waitingJoinningMember list to member list (private+free)
  allowWaitingMember() {
    this.groupService.allowWaitingMember(this.uid, this.group.id);
  }
}
