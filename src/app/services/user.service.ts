import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getUser(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  getUserFromSearchId(searchId: string): Observable<User> {
    return this.db
      .collection<User>(`users`, (ref) => ref.where('searchId', '==', searchId))
      .valueChanges()
      .pipe(
        map((targets: User[]) => {
          return targets[0];
        })
      );
  }

  updateUser(user: Omit<User, 'notifications' | 'notificationCount'>) {
    this.db.doc(`users/${user.uid}`).set(user, { merge: true });
  }

  async upload(path: string, base64: string): Promise<string> {
    const ref = this.storage.ref(path);
    const result = await ref.putString(base64, 'data_url');
    return result.ref.getDownloadURL();
  }
}