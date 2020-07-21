import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Id } from '../interfaces/id';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  async inviteToGroup(uid: string, groupId: string) {
    if (uid !== this.authService.uid) {
      const memberIds: string[] = [];
      this.db
        .collection<Id>(`groups/${groupId}/memberIds`)
        .valueChanges()
        .subscribe((MemberIds: Id[]) => {
          MemberIds.map((MemberId: Id) => {
            memberIds.push(MemberId.id);
          });
          if (memberIds.includes(uid)) {
            return;
          } else {
            this.db
              .doc(`groups/${groupId}/invitingUserIds/${uid}`)
              .set({ id: uid })
              .then(() => {
                this.db
                  .doc(`users/${uid}/invitedGroupIds/${groupId}`)
                  .set({ id: groupId });
              });
          }
        });
    } else {
      return;
    }
  }

  uninviteFromGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedGroupIds/${groupId}`).delete();
      });
  }

  inviteToEvent(uid: string, eventId: string) {
    if (uid !== this.authService.uid) {
      const memberIds: string[] = [];
      this.db
        .collection<Id>(`events/${eventId}/attendingMemberIds`)
        .valueChanges()
        .subscribe((attendingMemberIds: Id[]) => {
          attendingMemberIds.map((attendingMemberId: Id) => {
            memberIds.push(attendingMemberId.id);
          });
          if (memberIds.includes(uid)) {
            return;
          } else {
            this.db
              .doc(`events/${eventId}/invitingUserIds/${uid}`)
              .set({ id: uid })
              .then(() => {
                this.db
                  .doc(`users/${uid}/invitedEventIds/${eventId}`)
                  .set({ id: eventId });
              });
          }
        });
    } else {
      return;
    }
  }

  uninviteFromEvent(uid: string, eventId: string) {
    this.db
      .doc(`events/${eventId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedEventIds/${eventId}`).delete();
      });
  }
}
