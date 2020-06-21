import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Notification } from '../interfaces/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private db: AngularFirestore) {}

  getNotifications(uid: string): Observable<Notification[]> {
    return this.db
      .doc(`users/${uid}`)
      .valueChanges()
      .pipe(
        map((notifications: Notification[]) => {
          return notifications;
        })
      );
  }

  clearNotificationCount(uid: string) {
    return this.db.doc(`users/${uid}`).update({
      notificationCount: 0,
    });
  }
}
