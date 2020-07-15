import { Component, OnInit } from '@angular/core';
import { ChatGetService } from 'src/app/services/chat-get.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  noChatRooms: boolean;

  chatRooms: Observable<ChatRoom[]>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private chatGetService: ChatGetService
  ) {}

  ngOnInit(): void {
    this.chatRooms = this.chatGetService
      .getMyChatRoommIds(this.authService.uid)
      .pipe(
        switchMap(
          (chatRoomIds: string[]): Observable<ChatRoom[]> => {
            if (chatRoomIds.length) {
              const ChatRooms: Observable<ChatRoom>[] = chatRoomIds.map(
                (chatRoomId: string) => {
                  return this.chatGetService.getChatRoom(chatRoomId);
                }
              );
              this.noChatRooms = false;
              return combineLatest(ChatRooms);
            } else {
              this.noChatRooms = true;
              return of(null);
            }
          }
        )
      );
  }

  clearMessageCount(chatRoomId: string) {
    this.chatService.clearMessageCount(chatRoomId);
  }
}
