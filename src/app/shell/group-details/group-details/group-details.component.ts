import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { Location } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { GroupDetailsDiaplogComponent } from '../group-details-diaplog/group-details-diaplog.component';
import { UserService } from 'src/app/services/user.service';
import { InviteService } from 'src/app/services/invite.service';
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  id: string;

  uid: string;

  ifadmin: boolean; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  ifmember: boolean;

  group: Group;
  creater: User;
  adminIds: string[];
  admins: User[];
  memberIds: string[];
  members: User[];
  waitingJoinningMembers: Observable<User[]>;
  waitingPayingMembers: Observable<User[]>;
  invitingUsers: User[];

  searchId: string;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService,
    private chatService: ChatService,
    private dialog: MatDialog,
    private inviteService: InviteService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id = params.get('id');

      this.uid = this.authService.uid;

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        this.group = group;
        this.userService
          .getUser(this.group.createrId)
          .subscribe((creater: User) => {
            this.creater = creater;
          });
      });

      this.groupService.getAdminIds(this.id).subscribe((adminIds: string[]) => {
        this.adminIds = adminIds;
        if (adminIds.length) {
          if (adminIds.includes(this.uid)) {
            this.ifadmin = true;
          } else {
            this.ifadmin = false;
          }
        }
        const admins: User[] = [];
        adminIds.forEach((adminId: string) => {
          this.userService.getUser(adminId).subscribe((admin: User) => {
            admins.push(admin);
          });
        });
        this.admins = admins;
      });

      this.groupService
        .getMemberIds(this.id)
        .subscribe((memberIds: string[]) => {
          this.memberIds = memberIds;
          if (memberIds.length) {
            if (memberIds.includes(this.uid)) {
              this.ifmember = true;
            } else {
              this.ifmember = false;
            }
          }
          const members: User[] = [];
          memberIds.forEach((memberId: string) => {
            this.userService.getUser(memberId).subscribe((member: User) => {
              members.push(member);
            });
          });
          this.members = members;
        });

      this.groupService
        .getWaitingJoinningMemberIds(this.id)
        .subscribe((waitingJoinningMemberIds: string[]) => {
          if (waitingJoinningMemberIds.length) {
            this.waitingJoinningMembers = combineLatest(
              waitingJoinningMemberIds.map((waitingMemberId) => {
                const waitingMember: Observable<User> = this.userService.getUser(
                  waitingMemberId
                );
                return waitingMember;
              })
            );
          }
        });

      this.groupService
        .getWaitingPayingMemberIds(this.id)
        .subscribe((waitingPayingMemberIds: string[]) => {
          if (waitingPayingMemberIds.length) {
            this.waitingPayingMembers = combineLatest(
              waitingPayingMemberIds.map((waitingPayingMemberId) => {
                const waitingPayingMember: Observable<User> = this.userService.getUser(
                  waitingPayingMemberId
                );
                return waitingPayingMember;
              })
            );
          }
        });

      this.inviteService
        .getGroupInvitingUsers(this.id)
        .subscribe((invitingUsers: User[]) => {
          this.invitingUsers = invitingUsers;
        });
    });
  }

  navigateBack() {
    this.location.back();
  }

  uninvite(uid: string) {
    this.inviteService.uninviteFromGroup(uid, this.id);
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(GroupDetailsDiaplogComponent, {
      width: '350px',
      data: { searchId: this.searchId },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.userService.getUserFromSearchId(result).subscribe((user: User) => {
          if (user) {
            this.inviteService.inviteToGroup(user.uid, this.group.id);
          } else {
            return;
          }
        });
        this.searchId = null;
      } else {
        return;
      }
    });
  }

  createChatRoom() {
    const chatRoomId = this.db.createId();
    this.chatService.createChatRoom(this.uid, {
      id: chatRoomId,
      name: this.group?.name,
      groupid: this.id,
      messageCount: 0,
    });
  }

  makeAdmin(uid: string) {
    this.groupService.makeAdmin(uid, this.id);
  }

  deleteAdmin(uid: string) {
    this.groupService.deleteAdmin(uid, this.id);
  }

  leaveGroup(uid: string) {
    this.groupService.leaveGroup(uid, this.id);
  }

  leaveWaitingList(waitingMemberId: string) {
    this.groupService.leaveWaitingList(waitingMemberId, this.id);
  }

  allowWaitingMember(waitingMemberId: string) {
    this.groupService.allowWaitingMember(waitingMemberId, this.id);
  }

  waitingJoinningMemberToWaitingPayingMember(waitingMemberId: string) {
    this.groupService.waitingJoinningMemberToWaitingPayingMember(
      waitingMemberId,
      this.id
    );
  }

  ngOnInit(): void {}
}
