import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { ChatRoom } from '../interfaces/chat-room';
import { Group } from '../interfaces/group';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  createChatRoom(uid: string, chatRoom: ChatRoom) {
    const id = chatRoom.id;
    this.db.doc(`chatRooms/${id}`).set(chatRoom);
  }

  getMyChatRoommIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Group>(`groups`, (ref) =>
        ref.where(`members`, 'array-contains', uid)
      )
      .valueChanges()
      .pipe(
        map((myGroups: Group[]) => {
          const chatRoomIds: string[] = [];
          myGroups.forEach((myGroup) => {
            chatRoomIds.push(myGroup.chatRoomId);
          });
          console.log(chatRoomIds);
          return chatRoomIds;
        })
      );
  }

  getChatRoom(chatRoomId: string): Observable<ChatRoom> {
    return this.db.doc<ChatRoom>(`chatRooms/${chatRoomId}`).valueChanges();
  }

  getMyChatRooms(uid: string): Observable<ChatRoom[]> {
    return this.db
      .collection<Group>(`groups`, (ref) =>
        ref.where(`members`, 'array-contains', uid)
      )
      .valueChanges()
      .pipe(
        map((myGroups: Group[]) => {
          const chatRoomIds: string[] = [];
          myGroups.forEach((myGroup) => {
            chatRoomIds.push(myGroup.chatRoomId);
          });
          console.log(chatRoomIds);
          return chatRoomIds;
        }),
        switchMap((chatRoomIds: string[]) => {
          const chatRooms: ChatRoom[] = [];
          chatRoomIds.forEach((chatRoomId) => {
            let chatRoom: ChatRoom;
            this.db
              .doc<ChatRoom>(`charRooms/${chatRoomId}`)
              .valueChanges()
              .subscribe((ChatRoom: ChatRoom) => {
                chatRoom = ChatRoom;
              });
            chatRooms.push(chatRoom);
          });
          console.log(chatRooms);
          return combineLatest(chatRooms);
        })
      );
  }

  sendMessage(message: Message, chatRoomId: string) {
    this.db
      .doc(`chatRooms/${chatRoomId}`)
      .update({ messages: firestore.FieldValue.arrayUnion(message) });
  }
}
