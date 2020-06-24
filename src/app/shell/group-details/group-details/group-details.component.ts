import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/interfaces/user';
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

  ifChatRoom: boolean; // チャットルームが作成済かどうか

  group: Group;
  name: string;
  description: string;
  private: boolean;
  grouppicture: number;
  createddate: Date;
  createrId: string;
  createrName: string;
  price: number;
  currency: string;
  chatRoomId: string;
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

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
    private groupService: GroupService,
    private authService: AuthService,
    private chatService: ChatService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id = params.get('id');

      this.uid = this.authService.uid;

      this.groupService
        .ifAdmin(this.uid, this.id)
        .subscribe((ifAdmin: boolean) => {
          this.ifadmin = ifAdmin;
        });

      const resultMemberIds: string[] = [];
      this.groupService
        .getMemberIds(this.id)
        .subscribe((memberIds: string[]) => {
          memberIds.forEach((memberId: string) => {
            resultMemberIds.push(memberId);
          });
        });
      this.memberIds = resultMemberIds;

      const resultAdminIds: string[] = [];
      this.groupService.getAdminIds(this.id).subscribe((adminIds: string[]) => {
        adminIds.forEach((adminId: string) => {
          resultAdminIds.push(adminId);
        });
      });
      this.adminIds = resultAdminIds;

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        this.group = group;
        this.name = group.name;
        this.description = group.description;
        this.createrId = group.createrId;
        this.authService.getUser(this.createrId).subscribe((creater: User) => {
          this.createrName = creater.displayName;
        });
        if (group.private) {
          this.private = true;
        } else {
          this.private = false;
        }
        this.grouppicture = group.grouppicture;
        this.createddate = group.createddate.toDate();
        this.price = group.price;
        this.currency = group.currency;
        if (group.chatRoomId) {
          this.chatRoomId = group.chatRoomId;
          this.ifChatRoom = true;
        } else {
          this.chatRoomId = null;
          this.ifChatRoom = false;
        }
      });

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        const adminIds: string[] = [];
        this.groupService
          .getAdminIds(group.id)
          .subscribe((AdminIds: string[]) => {
            AdminIds.forEach((AdminId: string) => {
              adminIds.push(AdminId);
            });
          });
        if (adminIds.length) {
          this.ifAdmins = true;
        } else {
          this.ifAdmins = false;
        }
      });

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        if (this.memberIds.length) {
          this.ifMembers = true;
          if (this.memberIds.includes(this.uid)) {
            this.ifmember = true;
          } else {
            this.ifmember = false;
          }
        } else {
          this.ifMembers = false;
          this.ifmember = false;
        }
      });

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        if (group.waitingJoinningMemberIds.length) {
          this.waitingJoinningMembers = combineLatest(
            group.waitingJoinningMemberIds.map((waitingMemberId) => {
              console.log(waitingMemberId);
              const waitingMember: Observable<User> = this.authService.getUser(
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

      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        if (group.waitingPayingMemberIds.length) {
          this.waitingPayingMembers = combineLatest(
            group.waitingPayingMemberIds.map((waitingPayingMemberId) => {
              console.log(waitingPayingMemberId);
              const waitingPayingMember: Observable<User> = this.authService.getUser(
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

  createChatRoom() {
    const chatRoomId = this.db.createId();
    this.chatService.createChatRoom({
      id: chatRoomId,
      name: this.name,
      groupid: this.id,
      members: [this.authService.uid],
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
