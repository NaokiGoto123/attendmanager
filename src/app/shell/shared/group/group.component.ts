import { Component, OnInit, Input } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { User } from 'src/app/interfaces/user';
import { InviteService } from 'src/app/services/invite.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  @Input() group: Group;

  uid: string;

  memberIds: string[];
  ifMember: boolean;
  overMemberLimit: boolean;
  ifWaitingJoinningMember: boolean;
  ifWaitingPayingMember: boolean;
  invited: boolean;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private inviteService: InviteService
  ) {}

  ngOnInit(): void {
    this.uid = this.authService.uid;
    if (this.group) {
      this.groupService
        .getMemberIds(this.group.id)
        .subscribe((memberIds: string[]) => {
          this.memberIds = memberIds;
          if (
            memberIds.length >= this.group?.memberlimit &&
            this.group?.memberlimit !== null
          ) {
            this.overMemberLimit = true;
          } else {
            this.overMemberLimit = false;
          }
          if (memberIds.includes(this.uid)) {
            this.ifMember = true;
          } else {
            this.ifMember = false;
          }
        });
      this.groupService
        .getWaitingJoinningMemberIds(this.group.id)
        .subscribe((waitingJoinningMemberIds: string[]) => {
          if (waitingJoinningMemberIds.length) {
            if (waitingJoinningMemberIds.includes(this.uid)) {
              this.ifWaitingJoinningMember = true;
            } else {
              this.ifWaitingJoinningMember = false;
            }
          } else {
            this.ifWaitingJoinningMember = false;
          }
        });
      this.groupService
        .getWaitingPayingMemberIds(this.group.id)
        .subscribe((waitingPayingMemberIds: string[]) => {
          if (waitingPayingMemberIds.length) {
            if (waitingPayingMemberIds.includes(this.uid)) {
              this.ifWaitingPayingMember = true;
            } else {
              this.ifWaitingPayingMember = false;
            }
          } else {
            this.ifWaitingPayingMember = false;
          }
        });
      this.inviteService
        .getGroupInvitingUsers(this.group.id)
        .subscribe((invitingUsers: User[]) => {
          const invitingUserIds: string[] = [];
          invitingUsers.map((invitingUser: User) => {
            invitingUserIds.push(invitingUser.uid);
          });
          if (invitingUserIds.includes(this.uid)) {
            this.invited = true;
          } else {
            this.invited = false;
          }
        });
    }
  }

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
    this.groupService.leaveGroup(this.uid, this.group.id);
  }

  // nothing to member (public+free)
  joinGroup() {
    this.groupService.joinGroup(this.uid, this.group.id);
  }

  // nothing to member (public+pay)
  payToJoinGroup() {
    this.groupService.payToJoinGroup(this.uid, this.group.id);
  }

  // waitingJoinningMember list to member list (private+free)
  allowWaitingMember() {
    this.groupService.allowWaitingMember(this.uid, this.group.id);
  }

  invitingUserListToMembers() {
    this.groupService.invitingUserListToMembers(this.uid, this.group.id);
  }

  PayToInvitingUserListToMembers() {
    this.groupService.PayToInvitingUserListToMembers(this.uid, this.group.id);
  }
}
