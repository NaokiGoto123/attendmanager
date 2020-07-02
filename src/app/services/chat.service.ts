import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatRoom } from '../interfaces/chat-room';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { Id } from '../interfaces/id';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private router: Router,
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  createChatRoom(uid: string, chatRoom: ChatRoom) {
    const id = chatRoom.id;
    this.db
      .doc(`chatRooms/${id}`)
      .set(chatRoom)
      .then(() =>
        this.db
          .doc(`groups/${chatRoom.groupid}`)
          .update({ chatRoomId: chatRoom.id })
      )
      .then(() => {
        this.db.doc(`chatRooms/${id}/memberIds/${uid}`).set({ id: uid });
      })
      .then(() =>
        this.router.navigate(['/chat/chat-detail'], {
          queryParams: { id: chatRoom.id },
        })
      );
  }

  joinChatRoom(uid: string, chatRoomId: string) {
    this.db.doc(`chatRooms/${chatRoomId}/memberIds/${uid}`).set({ id: uid });
  }

  leaveChatRoom(uid: string, chatRoomId: string) {
    this.db.doc(`chatRooms/${chatRoomId}/memberIds/${uid}`).delete();
  }

  getMyChatRoommIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Id>(`users/${uid}/groupIds`)
      .valueChanges()
      .pipe(
        switchMap((groupIds: Id[]) => {
          if (groupIds.length) {
            const myGroups: Observable<Group>[] = [];
            groupIds.forEach((groupId: Id) => {
              myGroups.push(
                this.db.doc<Group>(`groups/${groupId.id}`).valueChanges()
              );
            });
            return combineLatest(myGroups);
          } else {
            return of([]);
          }
        }),
        map((myGroups: Group[]) => {
          if (myGroups.length) {
            const chatRoomIds: string[] = [];
            myGroups.forEach((myGroup: Group) => {
              if (myGroup.chatRoomId) {
                chatRoomIds.push(myGroup.chatRoomId);
              }
            });
            return chatRoomIds;
          } else {
            return [];
          }
        })
      );
  }

  getChatRoom(chatRoomId: string): Observable<ChatRoom> {
    return this.db.doc<ChatRoom>(`chatRooms/${chatRoomId}`).valueChanges();
  }

  getChatRooomMembers(chatRoomId: string): Observable<User[]> {
    return this.db
      .collection<Id>(`chatRooms/${chatRoomId}/memberIds`)
      .valueChanges()
      .pipe(
        switchMap((memberIds: Id[]) => {
          const members: Observable<User>[] = [];
          memberIds.map((memberId: Id) => {
            members.push(
              this.db.doc<User>(`users/${memberId.id}`).valueChanges()
            );
          });
          return combineLatest(members);
        })
      );
  }

  getMessages(chatRoomId: string) {
    return this.db
      .collection(`chatRooms/${chatRoomId}/messages`, (ref) =>
        ref.orderBy('sentAt')
      )
      .valueChanges();
  }

  sendMessage(message: Message, chatRoomId: string) {
    this.db
      .doc(`chatRooms/${chatRoomId}/messages/${message.id}`)
      .set(message)
      .then(() => {
        this.db
          .doc(`chatRooms/${chatRoomId}`)
          .update({ messageCount: firestore.FieldValue.increment(1) });
      });
  }

  clearMessageCount(chatRoomId: string) {
    this.db.doc(`chatRooms/${chatRoomId}`).update({ messageCount: 0 });
  }

  async deleteChatRoom(chatRoomId: string) {
    const deleteChatRoomFunction = this.fns.httpsCallable('deleteChatRoom');
    const result = await deleteChatRoomFunction(chatRoomId).toPromise();
  }
}
