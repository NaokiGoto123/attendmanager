import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { Message } from 'src/app/interfaces/message';
import { AuthService } from 'src/app/services/auth.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  loading = true;

  noMessage: boolean;

  chatRoomId: string;

  uid: string;

  photoURL: string;

  message = '';

  name: string;

  messages: Message[];

  groupid: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.uid = this.authService.uid;
    this.photoURL = this.authService.photoURL;
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const chatRoomId = params.get('id');
      this.chatRoomId = chatRoomId;
      this.chatService
        .getChatRoom(chatRoomId)
        .subscribe((ChatRoom: ChatRoom) => {
          this.name = ChatRoom.name;
          this.groupid = ChatRoom.groupid;
          if (ChatRoom.messages === null) {
            this.messages = [];
            this.noMessage = true;
          } else {
            if (ChatRoom.messages.length) {
              this.messages = ChatRoom.messages;
              this.noMessage = false;
            } else {
              this.messages = [];
              this.noMessage = true;
            }
          }
        });
    });
    this.loading = false;
  }

  send() {
    this.chatService.sendMessage(
      {
        ownerId: this.uid,
        ownerPhotoURL: this.photoURL,
        content: this.message,
        sentAt: firestore.Timestamp.now(),
      },
      this.chatRoomId
    );
    this.message = null;
  }
}
