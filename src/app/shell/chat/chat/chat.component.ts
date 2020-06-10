import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoom } from 'src/app/interfaces/chat-room';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  message: string;

  chatRooms: ChatRoom[];

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService
      .getMyChatRooms(this.authService.uid)
      .subscribe((chatRooms: ChatRoom[]) => {
        this.chatRooms = chatRooms;
        console.log(chatRooms);
      });
  }

  send() {
    console.log(this.message);
  }
}
