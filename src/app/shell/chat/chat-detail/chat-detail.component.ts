import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { Message } from 'src/app/interfaces/message';
import { AuthService } from 'src/app/services/auth.service';
import { firestore } from 'firebase';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

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

  form = this.fb.group({
    message: [''],
  });

  name: string;

  messages: Message[];

  groupid: string;

  constructor(
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private fb: FormBuilder
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
        .subscribe((chatRoom: ChatRoom) => {
          this.name = chatRoom.name;
          this.groupid = chatRoom.groupid;
          this.chatService
            .getMessages(chatRoomId)
            .subscribe((messages: Message[]) => {
              if (messages === null) {
                this.messages = [];
                this.noMessage = true;
              } else {
                if (messages.length) {
                  this.messages = messages;
                  this.noMessage = false;
                } else {
                  this.messages = [];
                  this.noMessage = true;
                }
              }
            });
        });
    });
    this.loading = false;
  }

  send() {
    this.chatService.sendMessage(
      {
        id: this.db.createId(),
        ownerId: this.uid,
        ownerPhotoURL: this.photoURL,
        content: this.form.value.message,
        sentAt: firestore.Timestamp.now(),
      },
      this.chatRoomId
    );
    this.form.reset();
  }
}
