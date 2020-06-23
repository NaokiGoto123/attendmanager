import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatRoom } from '../interfaces/chat-room';
import { Group } from '../interfaces/group';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import { firestore } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private router: Router,
    private db: AngularFirestore,
    private authService: AuthService
  ) {}

  createChatRoom(chatRoom: ChatRoom) {
    const id = chatRoom.id;
    this.db
      .doc(`chatRooms/${id}`)
      .set(chatRoom)
      .then(() =>
        this.db
          .doc(`groups/${chatRoom.groupid}`)
          .update({ chatRoomId: chatRoom.id })
      )
      .then(() =>
        this.router.navigate(['/chat/chat-detail'], {
          queryParams: { id: chatRoom.id },
        })
      );
    console.log('Successfully created a chatRoom');
  }

  getMyChatRoommIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Group>(`groups`, (ref) =>
        ref.where(`memberIds`, 'array-contains', uid)
      )
      .valueChanges()
      .pipe(
        map((myGroups: Group[]) => {
          const chatRoomIds: string[] = [];
          myGroups.forEach((myGroup: Group) => {
            if (myGroup.chatRoomId) {
              chatRoomIds.push(myGroup.chatRoomId);
            }
          });
          return chatRoomIds;
        })
      );
  }

  getChatRoom(chatRoomId: string): Observable<ChatRoom> {
    return this.db.doc<ChatRoom>(`chatRooms/${chatRoomId}`).valueChanges();
  }

  sendMessage(message: Message, chatRoomId: string) {
    this.db
      .doc(`chatRooms/${chatRoomId}`)
      .update({ messages: firestore.FieldValue.arrayUnion(message) });
  }

  clearMessageCount() {}
}
