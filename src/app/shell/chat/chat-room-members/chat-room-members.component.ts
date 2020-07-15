import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/interfaces/user';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ChatGetService } from 'src/app/services/chat-get.service';

@Component({
  selector: 'app-chat-room-members',
  templateUrl: './chat-room-members.component.html',
  styleUrls: ['./chat-room-members.component.scss'],
})
export class ChatRoomMembersComponent implements OnInit {
  uid = this.authService.uid;

  chatRoom: ChatRoom;

  chatRoomMembers: User[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private chatService: ChatService,
    private chatGetService: ChatGetService,
    private location: Location
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const chatRoomId = params.get('id');
      this.chatGetService
        .getChatRoom(chatRoomId)
        .subscribe((chatRoom: ChatRoom) => {
          this.chatRoom = chatRoom;
        });
      this.chatGetService
        .getChatRooomMembers(chatRoomId)
        .subscribe((chatRoomMembers: User[]) => {
          this.chatRoomMembers = chatRoomMembers;
        });
    });
  }

  navigateBack() {
    this.location.back();
  }

  removeMember() {
    this.chatService.leaveChatRoom(this.authService.uid, this.chatRoom?.id);
  }

  ngOnInit(): void {}
}
