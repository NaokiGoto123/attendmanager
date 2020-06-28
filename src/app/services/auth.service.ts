import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.photoURL = user.photoURL;
        this.displayName = user.displayName;
        this.email = user.email;
      } else {
        this.uid = null;
        this.photoURL = null;
        this.displayName = null;
        this.email = null;
      }
    });
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData({
      ...credential.user,
      searchId: this.db.createId(),
      description: '',
      notificationCount: 0,
      showGroups: true,
      showAttendingEvents: true,
      showAttendedEvents: true,
    });
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/welcome']);
  }

  private updateUserData({
    uid,
    searchId,
    displayName,
    email,
    photoURL,
    description,
    notificationCount,
    showGroups,
    showAttendingEvents,
    showAttendedEvents,
  }: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${uid}`);

    const data = {
      uid,
      searchId,
      displayName,
      email,
      photoURL,
      description,
      notificationCount,
      showGroups,
      showAttendingEvents,
      showAttendedEvents,
    };

    return userRef
      .set(data, { merge: true })
      .then(() => this.router.navigateByUrl(''))
      .then(() => this.snackbar.open('signed in', null, { duration: 2000 }));
  }

  getName(uid: string): Observable<string> {
    return this.db
      .doc<User>(`users/${uid}`)
      .valueChanges()
      .pipe(
        map((user: User) => {
          return user.displayName;
        })
      );
  }

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
    this.db
      .doc(`users/${user.uid}`)
      .set(user, { merge: true })
      .then(() => {})
      .then(() =>
        this.snackbar.open('Successfully updated settings', null, {
          duration: 2000,
        })
      );
  }

  async upload(path: string, base64: string): Promise<string> {
    const ref = this.storage.ref(path);
    const result = await ref.putString(base64, 'data_url');
    return result.ref.getDownloadURL();
  }
}
