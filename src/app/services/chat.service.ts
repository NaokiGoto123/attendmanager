import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatRoom } from '../interfaces/chat-room';
import { Message } from '../interfaces/message';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';

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
