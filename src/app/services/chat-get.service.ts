import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatRoom } from '../interfaces/chat-room';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message, MessageWithUser } from '../interfaces/message';
import { Id } from '../interfaces/id';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class ChatGetService {
  constructor(private db: AngularFirestore) {}

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

  getAllMesssageCounts(uid: string): Observable<number> {
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
        }),
        switchMap((chatRoomIds: string[]) => {
          const chatRooms: Observable<ChatRoom>[] = [];
          chatRoomIds.map((chatRoomId: string) => {
            chatRooms.push(
              this.db.doc<ChatRoom>(`chatRooms/${chatRoomId}`).valueChanges()
            );
          });
          return combineLatest(chatRooms);
        }),
        map((chatRooms: ChatRoom[]) => {
          let messageCount = 0;
          chatRooms.map((chatRoom: ChatRoom) => {
            messageCount += chatRoom.messageCount;
          });
          return messageCount;
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

  getMessages(chatRoomId: string): Observable<Message[]> {
    return this.db
      .collection<Message>(`chatRooms/${chatRoomId}/messages`, (ref) =>
        ref.orderBy('sentAt')
      )
      .valueChanges()
      .pipe(
        map((messages: Message[]) => {
          if (messages.length) {
            return messages;
          } else {
            return [];
          }
        })
      );
  }

  getMessagesWithUsers(chatRoomId: string): Observable<MessageWithUser[]> {
    return this.db
      .collection<Message>(`chatRooms/${chatRoomId}/messages`, (ref) =>
        ref.orderBy('sentAt')
      )
      .valueChanges()
      .pipe(
        switchMap((messages: Message[]) => {
          const messagesWithOwners: Observable<
            [Message, User]
          >[] = messages.map((message: Message) => {
            const owner: Observable<User> = this.db
              .doc<User>(`users/${message.ownerId}`)
              .valueChanges();
            return combineLatest([of(message), owner]);
          });
          return combineLatest(messagesWithOwners);
        }),
        map((messagesWithOwners: [Message, User][]) => {
          const messagesWithUsers: MessageWithUser[] = [];
          messagesWithOwners.map((messageWithOwner: [Message, User]) => {
            const messageWithUser: MessageWithUser = {
              id: messageWithOwner[0].id,
              ownerId: messageWithOwner[0].ownerId,
              ownerPhotoURL: messageWithOwner[0].ownerPhotoURL,
              content: messageWithOwner[0].content,
              sentAt: messageWithOwner[0].sentAt,
              searchId: messageWithOwner[1].searchId,
              displayName: messageWithOwner[1].displayName,
              photoURL: messageWithOwner[1].photoURL,
            };
            messagesWithUsers.push(messageWithUser);
          });
          return messagesWithUsers;
        })
      );
  }
}
