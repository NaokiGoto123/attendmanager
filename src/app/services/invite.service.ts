import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  constructor(private db: AngularFirestore) {}

  inviteToGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUsers/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db
          .doc(`users/${uid}/invitedGroupIds/${groupId}`)
          .set({ id: groupId });
      });
  }

  uninviteFromGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUsers/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedGroupIds/${groupId}`).delete();
      });
  }
}
