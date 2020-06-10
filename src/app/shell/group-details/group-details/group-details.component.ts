import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { Observable, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { map, switchMap } from 'rxjs/operators';
import { Event } from 'src/app/interfaces/event';
import { Location } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  id: string;

  uid: string;

  ifadmin: Observable<boolean>; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  ifChatRoom: boolean; // チャットルームが作成済かどうか

  name: string;
  description: Observable<string>;
  grouppicture: Observable<number>;
  createddate: Date;
  creater: Observable<string>;
  admins: Observable<string[]>;
  memberIds: string[];
  memberNames: Observable<string[]>;
  events: Observable<Event[]>;
  chatRoomId: string;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
    private groupService: GroupService,
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id = params.get('id');
      this.uid = this.authService.uid;
      this.ifadmin = this.groupService.checkIfAdmin(this.uid, this.id);
      this.groupService.getGroupinfo(this.id).subscribe((group) => {
        if (group.chatRoomId) {
          console.log(group.chatRoomId);
          this.ifChatRoom = true;
        } else {
          this.ifChatRoom = false;
        }
      });
      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        this.name = group.name;
      });
      this.description = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.description));
      this.grouppicture = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.grouppicture));
      this.groupService.getGroupinfo(this.id).subscribe((group) => {
        this.createddate = group.createddate.toDate();
      });
      this.groupService.getGroupinfo(this.id).subscribe((group) => {
        this.chatRoomId = group.chatRoomId;
      });
      this.creater = this.groupService.getGroupinfo(this.id).pipe(
        switchMap(
          (group: Group): Observable<string> => {
            return this.authService.getName(group.creater);
          }
        )
      );
      this.admins = this.groupService.getGroupinfo(this.id).pipe(
        map((group: Group) => {
          return group.admin;
        }),
        switchMap(
          (adminIds: string[]): Observable<string[]> => {
            const result: Observable<string>[] = [];
            adminIds.forEach((admin: string) => {
              result.push(this.authService.getName(admin));
            });
            return combineLatest(result);
          }
        )
      );
      this.groupService.getGroupinfo(this.id).subscribe((group: Group) => {
        this.memberIds = group.members;
      });
      this.memberNames = this.groupService.getGroupinfo(this.id).pipe(
        map((group: Group) => {
          return group.members;
        }),
        switchMap(
          (memberIds: string[]): Observable<string[]> => {
            const result: Observable<string>[] = [];
            memberIds.forEach((member: string) => {
              result.push(this.authService.getName(member));
            });
            return combineLatest(result);
          }
        )
      );
      this.events = this.eventService.getOneGroupEvents(this.id);
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
      messages: null,
    });
  }

  ngOnInit(): void {}
}
