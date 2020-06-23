import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private db: AngularFirestore) {}

  getNotifications(uid: string) {
    return this.db.collection(`users/${uid}/notifications`).valueChanges();
  }

  clearNotificationCount(uid: string) {
    return this.db.doc(`users/${uid}`).update({
      notificationCount: 0,
    });
  }
}
