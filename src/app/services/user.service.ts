import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private router: Router
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

  async deleteAccount(uid: string) {
    const deleteAccountFunction = this.fns.httpsCallable('deleteAccount');
    const result = await deleteAccountFunction(uid).toPromise();
    await this.afAuth.signOut();
    await this.router.navigateByUrl('/welcome');
  }
}
