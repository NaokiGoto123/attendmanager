import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private db: AngularFirestore) {}

  getNotifications(uid: string): Observable<Notification[]> {
    return this.db
      .collection<Notification>(`users/${uid}/notifications`)
      .valueChanges();
  }

  clearNotificationCount(uid: string) {
    return this.db.doc(`users/${uid}`).update({
      notificationCount: 0,
    });
  }
}
