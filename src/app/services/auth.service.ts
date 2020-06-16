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
    private afs: AngularFirestore,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
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
      description: '',
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
    displayName,
    email,
    photoURL,
    description,
    showGroups,
    showAttendingEvents,
    showAttendedEvents,
  }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data = {
      uid,
      displayName,
      email,
      photoURL,
      description,
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
    return this.afs
      .doc<User>(`users/${uid}`)
      .valueChanges()
      .pipe(
        map((user: User) => {
          return user.displayName;
        })
      );
  }

  getUser(uid: string): Observable<User> {
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }

  updateUser(user: User) {
    this.afs
      .doc<User>(`users/${user.uid}`)
      .set(user, { merge: true })
      .then(() =>
        this.snackbar.open('Successfully updated settings', null, {
          duration: 2000,
        })
      );
  }

  // deleteUser(uid: string) {

  // }
}
