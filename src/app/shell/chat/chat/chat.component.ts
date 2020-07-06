import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { GroupService } from 'src/app/services/group.service';
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
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.chatRooms = this.chatService
      .getMyChatRoommIds(this.authService.uid)
      .pipe(
        switchMap(
          (chatRoomIds: string[]): Observable<ChatRoom[]> => {
            if (chatRoomIds.length) {
              const ChatRooms: Observable<ChatRoom>[] = chatRoomIds.map(
                (chatRoomId: string) => {
                  return this.chatService.getChatRoom(chatRoomId);
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
