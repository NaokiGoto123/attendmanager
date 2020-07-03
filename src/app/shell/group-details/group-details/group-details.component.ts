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

  noGroup: boolean;

  ifadmin: boolean; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  ifmember: boolean;

  ifChatRoom: boolean; // チャットルームが作成済かどうか

  group: Group;
  creater: User;
  adminIds: string[];
  admins: User[];
  ifAdmins: boolean;
  memberIds: string[];
  members: User[];
  ifMembers: boolean;
  waitingJoinningMembers: Observable<User[]>;
  waitingPayingMembers: Observable<User[]>;
  ifWaitingJoinningMembers: boolean;
  ifWaitingPayingMemberId: boolean;

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
        if (group) {
          this.noGroup = false;
        } else {
          this.noGroup = true;
        }
        this.group = group;
        this.userService
          .getUser(this.group.createrId)
          .subscribe((creater: User) => {
            this.creater = creater;
          });
        if (group.chatRoomId) {
          this.ifChatRoom = true;
        } else {
          this.ifChatRoom = false;
        }
      });

      this.groupService.getAdminIds(this.id).subscribe((adminIds: string[]) => {
        this.adminIds = adminIds;
        if (adminIds.length) {
          this.ifAdmins = true;
          if (adminIds.includes(this.uid)) {
            this.ifadmin = true;
          } else {
            this.ifadmin = false;
          }
        } else {
          this.ifAdmins = false;
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
            this.ifMembers = true;
            if (memberIds.includes(this.uid)) {
              this.ifmember = true;
            } else {
              this.ifmember = false;
            }
          } else {
            this.ifMembers = false;
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
            this.ifWaitingJoinningMembers = true;
          } else {
            this.ifWaitingJoinningMembers = false;
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
            this.ifWaitingPayingMemberId = true;
          } else {
            this.ifWaitingPayingMemberId = false;
          }
        });
    });
  }

  navigateBack() {
    this.location.back();
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(GroupDetailsDiaplogComponent, {
      width: '350px',
      data: { searchId: this.searchId },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('this is result', result);
      if (result) {
        this.userService.getUserFromSearchId(result).subscribe((user: User) => {
          console.log(user);
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
